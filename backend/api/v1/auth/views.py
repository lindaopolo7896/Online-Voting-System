from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User
from apps.elections.models import Candidate
from services.otp_service import issue_otp, verify_otp
from services.voting_link_service import resolve_voting_link
from .serializers import RequestOTPSerializer, VerifyOTPSerializer


class RequestOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        voting_token = serializer.validated_data.get('voting_token')

        # Only send to a real, active account, but always return the same
        # response so the endpoint can't be used to enumerate registered emails.
        user = User.objects.filter(email=email, is_active=True).first()
        link = resolve_voting_link(voting_token, require_active=True) if voting_token else None
        is_eligible_link = (
            user is not None
            and link is not None
            and link.participant.membership.user_id == user.id
            and not link.participant.has_voted
        )
        if user is not None and (not voting_token or is_eligible_link):
            issue_otp(user)

        return Response({'detail': 'If the email is registered, a login code has been sent.'})


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        voting_token = serializer.validated_data.get('voting_token')

        user = User.objects.filter(email=email, is_active=True).first()
        if user is None or not verify_otp(user, code):
            return Response({'detail': 'Invalid or expired code.'}, status=400)
        eligibility = None
        ballot = None
        if voting_token:
            link = resolve_voting_link(voting_token, require_active=True)
            if link is None or link.participant.membership.user_id != user.id:
                return Response({'detail': 'Invalid or expired voting link.'}, status=400)
            if link.participant.has_voted:
                return Response({'detail': 'You are not eligible to vote: ballot already cast.'}, status=400)

            candidates = (
                Candidate.objects
                .select_related('position', 'membership__user')
                .filter(election_id=link.election_id, status='active')
                .order_by('position_id', 'id')
            )
            ballot = [
                {
                    'candidate_id': candidate.id,
                    'position_id': candidate.position_id,
                    'position_name': candidate.position.name,
                    'candidate_name': candidate.membership.user.get_full_name() or candidate.membership.user.email,
                    'slogan': candidate.slogan,
                }
                for candidate in candidates
            ]
            eligibility = {
                'eligible': True,
                'election_id': link.election_id,
            }

        refresh = RefreshToken.for_user(user)
        response_payload = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
        if eligibility is not None:
            response_payload['eligibility'] = eligibility
            response_payload['ballot'] = ballot
        return Response(response_payload)
