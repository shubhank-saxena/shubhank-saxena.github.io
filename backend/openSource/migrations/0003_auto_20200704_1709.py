# Generated by Django 3.0.8 on 2020-07-04 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('openSource', '0002_auto_20200704_1703'),
    ]

    operations = [
        migrations.AlterField(
            model_name='opensource',
            name='image',
            field=models.ImageField(upload_to='images/'),
        ),
    ]
