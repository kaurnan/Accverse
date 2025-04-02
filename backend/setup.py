import mysql.connector
import os
import bcrypt
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

def setup_database():
    print("Setting up database...")
    
    # Database connection parameters
    db_config = {
        'host': os.environ.get('DB_HOST', 'localhost'),
        'user': os.environ.get('DB_USER', 'root'),
        'password': os.environ.get('DB_PASSWORD', 'mysql.0987mysql'),
    }
    
    try:
        # Create database if it doesn't exist
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE IF NOT EXISTS Accverse")
        print("Database created or already exists.")
        
        # Switch to the database
        cursor.execute("USE Accverse")
        
        # Read SQL file and execute statements
        with open('database.sql', 'r') as file:
            sql_script = file.read()
            # Split SQL script into individual statements
            statements = sql_script.split(';')
            
            for statement in statements:
                if statement.strip():
                    cursor.execute(statement)
            
            conn.commit()
        
        print("Database schema and sample data created successfully.")
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

def create_admin_user():
    print("Creating admin user...")
    
    db_config = {
        'host': os.environ.get('DB_HOST', 'localhost'),
        'user': os.environ.get('DB_USER', 'root'),
        'password': os.environ.get('DB_PASSWORD', 'mysql.0987mysql'),
        'database': 'Accverse'
    }
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Check if admin already exists
        cursor.execute("SELECT id FROM users WHERE email = 'admin@taxprosolutions.com'")
        admin = cursor.fetchone()
        
        if not admin:
            # Hash password
            password = "admin123"
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create admin user
            cursor.execute(
                "INSERT INTO users (name, email, password, role, is_verified) VALUES (%s, %s, %s, %s, %s)",
                ("Admin User", "admin@taxprosolutions.com", hashed_password, "admin", True)
            )
            conn.commit()
            print("Admin user created.")
        else:
            print("Admin user already exists.")
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    setup_database()
    create_admin_user()
    print("Setup complete!")
