from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Extended user with optional avatar."""
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username
