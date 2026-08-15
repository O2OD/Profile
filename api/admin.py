from django.contrib import admin
from .models import Profile, SocialLink, Video

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'order')
    list_editable = ('order',) # Admin panelni o'zidan turib tartibni o'zgartira oladi

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order')
    list_editable = ('is_active', 'order')
    list_filter = ('is_active',) # Faqat aktiv yoki noaktiv videolarni saralash funksiyasi