# Generated by Django 4.2.9 on 2024-01-30 03:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todoitem',
            name='created',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='todoitem',
            name='duedate',
            field=models.DateField(blank=True, null=True),
        ),
    ]
