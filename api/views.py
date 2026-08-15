from rest_framework import viewsets
from .models import Profile, SocialLink, Video
from .serializers import ProfileSerializer, SocialLinkSerializer, VideoSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class SocialLinkViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer

class VideoViewSet(viewsets.ModelViewSet):
    # Endi admin panelda hamma videolarni ko'rishimiz uchun .all() qoldiramiz
    queryset = Video.objects.all().order_by('-id') 
    serializer_class = VideoSerializer