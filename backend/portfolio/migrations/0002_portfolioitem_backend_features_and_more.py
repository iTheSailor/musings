# Generated by Django 4.2.9 on 2024-06-08 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='portfolioitem',
            name='backend_features',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='portfolioitem',
            name='frontend_features',
            field=models.TextField(blank=True),
        ),
    ]
