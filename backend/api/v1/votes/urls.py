from rest_framework.routers import DefaultRouter

from .views import VoteViewSet, VotingLinkViewSet

router = DefaultRouter()
router.register('votes', VoteViewSet)
router.register('voting-links', VotingLinkViewSet)

urlpatterns = router.urls
