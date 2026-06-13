from rest_framework.routers import DefaultRouter

from .views import (
    OrganisationViewSet,
    UserViewset,
    MembershipViewset,
    PermissionRecordViewset,
    ElectionViewset,
    LogViewset,
)

router = DefaultRouter()
router.register('organisations', OrganisationViewSet)
router.register('users', UserViewset)
router.register('memberships', MembershipViewset)
router.register('permission-records', PermissionRecordViewset)
router.register('elections', ElectionViewset)
router.register('logs', LogViewset)

urlpatterns = router.urls
