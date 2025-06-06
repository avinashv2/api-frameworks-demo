from django.db import models

class URL(models.Model):
    original_url = models.URLField(max_length=200)
    short_url = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return f'{self.original_url} -> {self.short_url}'
