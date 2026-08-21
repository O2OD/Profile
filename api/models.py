from django.db import models
from cloudinary_storage.storage import VideoMediaCloudinaryStorage

class Profile(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField()
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

class SocialLink(models.Model):
    platform = models.CharField(max_length=50)
    url = models.TextField()
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']

class Post(models.Model):
    # Post turi: Video, Rasm yoki Audio
    POST_TYPES = (
        ('video', 'YouTube Video'),
        ('image', 'Rasm va Status'),
        ('audio', 'Audio / Qo\'shiq'), # Yangi tur qo'shildi
    )
    type = models.CharField(max_length=10, choices=POST_TYPES, default='video')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # Video uchun
    video_url = models.URLField(blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True)
    
    # Rasm uchun
    image = models.ImageField(upload_to='posts/', blank=True, null=True)

    # Audio uchun (YANGI)
    audio = models.FileField(
        upload_to='audios/', 
        storage=VideoMediaCloudinaryStorage(), 
        blank=True, 
        null=True
        )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']