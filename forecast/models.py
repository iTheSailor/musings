from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserLocation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=250)
    nickname = models.CharField(max_length=250, blank=True, null=True)
    lat = models.CharField(max_length=100)
    lon = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.nickname: 
            self.nickname = self.address
        super(UserLocation, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} - {self.nickname}'