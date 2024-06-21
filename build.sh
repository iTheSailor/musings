#!/usr/bin/env bash
set -o errexit  # Exit on error

# Install dependencies
pip install -r requirements.txt

# Move React build to Django static folder
mv frontend/build/* backend/static/

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate
