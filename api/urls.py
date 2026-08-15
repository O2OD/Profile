from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, SocialLinkViewSet, PostViewSet

router = DefaultRouter()
router.register(r'profile', ProfileViewSet)
router.register(r'social-links', SocialLinkViewSet)
router.register(r'posts', PostViewSet) # videos o'rniga posts bo'ldi

urlpatterns = [
    path('', include(router.urls)),
]