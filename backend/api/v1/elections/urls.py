from rest_framework.routers import DefaultRouter

from .view import PositionViewSet, ParticipantViewSet, CandidateViewSet

# These resources are nested under an election; the parent route supplies
# `election_id` (see api/urls.py), which each viewset reads in get_queryset.
router = DefaultRouter()
router.register('positions', PositionViewSet)
router.register('participants', ParticipantViewSet)
router.register('candidates', CandidateViewSet)

urlpatterns = router.urls
