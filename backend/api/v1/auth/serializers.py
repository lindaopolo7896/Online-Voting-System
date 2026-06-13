from rest_framework import serializers


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    voting_token = serializers.CharField(required=False, allow_blank=True)


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()
    voting_token = serializers.CharField(required=False, allow_blank=True)
