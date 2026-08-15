from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField()
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

class SocialLink(models.Model):
    platform = models.CharField(max_length=50)
    url = models.URLField()
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']

class Post(models.Model):
    # Post turi: Video yoki Oddiy rasm/status
    POST_TYPES = (
        ('video', 'YouTube Video'),
        ('image', 'Rasm va Status'),
    )
    type = models.CharField(max_length=10, choices=POST_TYPES, default='video')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True) # Katta matn yozish uchun
    
    # Agar video bo'lsa
    video_url = models.URLField(blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True) # YouTube'dan olingan rasm
    
    # Agar oddiy rasm/status bo'lsa
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True) # Qachon qo'shilgani
    
    class Meta:
        ordering = ['-created_at'] # Eng yangilari birinchi chiqadi