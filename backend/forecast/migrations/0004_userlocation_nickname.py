# Generated by Django 4.2.9 on 2024-02-12 22:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forecast', '0003_alter_userlocation_lat_alter_userlocation_lon'),
    ]

    operations = [
        migrations.AddField(
            model_name='userlocation',
            name='nickname',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]