
from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=255, verbose_name="Ism")
    bio = models.TextField(verbose_name="Qisqacha ma'lumot")
    image = models.ImageField(upload_to='profile_pics/', verbose_name="Profil rasmi")

    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Profil ma'lumotlari"

    def __str__(self):
        return self.name


class SocialLink(models.Model):
    
    PLATFORM_CHOICES = (
        ('youtube', 'YouTube'),
        ('telegram', 'Telegram'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('other', 'Boshqa'),
    )
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, verbose_name="Ijtimoiy tarmoq")
    url = models.URLField(verbose_name="Link (URL manzil)")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami (saytda chiqish ketma-ketligi)")

    class Meta:
        ordering = ['order']
        verbose_name = "Ijtimoiy tarmoq"
        verbose_name_plural = "Ijtimoiy tarmoqlar"

    def __str__(self):
        return f"{self.get_platform_display()} - {self.url}"


class Video(models.Model):
    title = models.CharField(max_length=255, verbose_name="Video sarlavhasi")
    video_url = models.URLField(verbose_name="Video linki (YouTube/Telegram/va hokazo)")
    thumbnail = models.URLField(verbose_name="Video muqovasi (Avtomatik)", blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name="Saytda ko'rinsinmi?")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        ordering = ['order']
        verbose_name = "Video"
        verbose_name_plural = "Videolar"

    def __str__(self):
        return self.title