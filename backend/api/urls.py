from django.urls import path, include

urlpatterns = [
    path('v1/auth/', include('api.v1.auth.urls')),
    path('v1/', include('api.v1.users.urls')),
    path('v1/', include('api.v1.votes.urls')),
    # election-scoped resources: election_id is captured here and passed
    # through to the nested viewsets.
    path('v1/elections/<int:election_id>/', include('api.v1.elections.urls')),
]
