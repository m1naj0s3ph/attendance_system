import sys
import os

# Add your project directory to the Python path
project_home = os.path.expanduser('~/attendance-system')
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import your Flask app
from app import app as application

# Initialize the application
if __name__ == "__main__":
    application.run()