import sys
import os

# Add your project directory to the Python path
project_home = '/home/yourusername/attendance-system'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import your Flask app
from app import app as application

# Optional: Force initialization
try:
    from app import initialize_app
    initialize_app()
except Exception as e:
    print(f"Initialization error: {e}")