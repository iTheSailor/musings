#!/usr/bin/env bash
# Exit on error
set -o errexit

cd backend

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate

# go to the frontend directory
cd ../frontend

# Modify this line as needed for your package manager (npm, yarn, etc.)
npm install

# Build the frontend

npm run build

#run frontend 

serve -s build