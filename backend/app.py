from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mysqldb import MySQL
from dotenv import load_dotenv
from google import genai
from google.genai import types
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta

from config import mysql

# Load Environment Variables
load_dotenv()

# Create Flask App
app = Flask(__name__)

# Enable CORS
CORS(app)

# Secret Keys
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=7)
# MySQL Configuration
app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
app.config["MYSQL_DB"] = os.getenv("MYSQL_DB")
mysql.init_app(app)

# JWT
jwt = JWTManager(app)
@jwt.unauthorized_loader
def unauthorized_callback(reason):
    print("JWT Unauthorized:", reason)
    return {"message": reason}, 401

@jwt.invalid_token_loader
def invalid_token_callback(reason):
    print("JWT Invalid:", reason)
    return {"message": reason}, 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print("JWT Expired")
    return {"message": "Token expired"}, 401

# Gemini AI
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Test Route
@app.route("/")
def home():
    return {
        "message": "Bug Tracker API Running Successfully"
    }
@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    cur = mysql.connection.cursor()

    cur.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    existing_user = cur.fetchone()

    if existing_user:
        cur.close()
        return {
            "message": "Email already exists"
        }, 400

    hashed_password = generate_password_hash(password)

    cur.execute(
        """
        INSERT INTO users(username,email,password,role)
        VALUES(%s,%s,%s,%s)
        """,
        (
            username,
            email,
            hashed_password,
            role
        )
    )

    mysql.connection.commit()

    cur.close()

    return {
        "message": "Registration Successful"
    }, 201
from flask_jwt_extended import create_access_token

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    cur = mysql.connection.cursor()

    cur.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    user = cur.fetchone()

    cur.close()

    if not user:
        return {
            "message": "Invalid Email"
        }, 401

    if not check_password_hash(user[3], password):

        return {
            "message": "Invalid Password"
        }, 401

    
    access_token = create_access_token(
    identity=email,
    expires_delta=timedelta(hours=7)
)
    return {
        "message": "Login Successful",
        "token": access_token,
        "username": user[1],
        "email": user[2],
        "role": user[4]
    }, 200
from flask_jwt_extended import jwt_required

@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard():

    cur = mysql.connection.cursor()

    # Total Users
    cur.execute("SELECT COUNT(*) FROM users")
    total_users = cur.fetchone()[0]

    # Total Projects
    cur.execute("SELECT COUNT(*) FROM projects")
    total_projects = cur.fetchone()[0]

    # Total Bugs
    cur.execute("SELECT COUNT(*) FROM bugs")
    total_bugs = cur.fetchone()[0]

    # Open Bugs
    cur.execute("SELECT COUNT(*) FROM bugs WHERE status='Open'")
    open_bugs = cur.fetchone()[0]

    # Closed Bugs
    cur.execute("SELECT COUNT(*) FROM bugs WHERE status='Closed'")
    closed_bugs = cur.fetchone()[0]

    cur.close()

    return {
        "total_users": total_users,
        "total_projects": total_projects,
        "total_bugs": total_bugs,
        "open_bugs": open_bugs,
        "closed_bugs": closed_bugs
    }, 200
@app.route("/api/projects", methods=["POST"])
@jwt_required()
def create_project():

    data = request.get_json()

    project_name = data.get("project_name")
    description = data.get("description")

    cur = mysql.connection.cursor()

    cur.execute(
        """
        INSERT INTO projects(project_name, description)
        VALUES(%s,%s)
        """,
        (project_name, description)
    )

    mysql.connection.commit()

    cur.close()

    return {
        "message": "Project Created Successfully"
    }, 201
@app.route("/api/projects", methods=["GET"])
@jwt_required()
def get_projects():

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT project_id, project_name, description
        FROM projects
        ORDER BY project_id DESC
    """)

    projects = cur.fetchall()

    cur.close()

    result = []

    for project in projects:
        result.append({
            "project_id": project[0],
            "project_name": project[1],
            "description": project[2]
        })

    return {
        "projects": result
    }, 200
@app.route("/api/projects/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project_details(project_id):

    cur = mysql.connection.cursor()

    # Get project
    cur.execute("""
        SELECT project_id, project_name, description
        FROM projects
        WHERE project_id=%s
    """, (project_id,))

    project = cur.fetchone()

    if not project:
        cur.close()
        return {"message": "Project not found"}, 404

    # Get bugs of this project
    cur.execute("""
        SELECT
            bug_id,
            title,
            description,
            priority,
            status
        FROM bugs
        WHERE project_id=%s
    """, (project_id,))

    bugs = cur.fetchall()

    cur.close()

    bug_list = []

    for bug in bugs:
        bug_list.append({
            "bug_id": bug[0],
            "title": bug[1],
            "description": bug[2],
            "priority": bug[3],
            "status": bug[4]
        })

    return {
        "project": {
            "project_id": project[0],
            "project_name": project[1],
            "description": project[2]
        },
        "bugs": bug_list
    }, 200
@app.route("/api/users", methods=["GET"])
@jwt_required()
def get_users():

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT user_id, username
        FROM users
        ORDER BY username
    """)

    users = cur.fetchall()

    cur.close()

    result = []

    for user in users:

        result.append({
            "user_id": user[0],
            "username": user[1]
        })

    return {
        "users": result
    }, 200
@app.route("/api/improve_bug", methods=["POST"])
@jwt_required()
def improve_bug():

    data = request.get_json()

    description = data.get("description")


    prompt = f"""
You are a software QA engineer.

Convert this bug description into a short professional bug report.

Bug Description:
{description}

Give output only in this format:

Title:
Summary:
Steps:
Expected:
Actual:
Priority:
Severity:

Keep each point short (1-2 lines only).
Do not add extra explanations.
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )


    return {
        "bug_report": response.text
    }, 200
@app.route("/api/bugs", methods=["POST"])
@jwt_required()
def create_bug():

    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    priority = data.get("priority")
    project_id = data.get("project_id")
    assigned_to = data.get("assigned_to")


    cur = mysql.connection.cursor()


    cur.execute(
        """
        INSERT INTO bugs
        (
            title,
            description,
            priority,
            project_id,
            assigned_to
        )
        VALUES(%s,%s,%s,%s,%s)
        """,
        (
            title,
            description,
            priority,
            project_id,
            assigned_to
        )
    )


    mysql.connection.commit()

    cur.close()


    return {
        "message":"Bug Reported Successfully"
    },201
@app.route("/api/bugs", methods=["GET"])
@jwt_required()
def get_bugs():

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT 
        bugs.bug_id,
        bugs.title,
        bugs.description,
        bugs.priority,
        bugs.status,
        bugs.project_id,
        users.username
        FROM bugs
        LEFT JOIN users
        ON bugs.assigned_to = users.user_id
        ORDER BY bugs.bug_id DESC
    """)


    bugs = cur.fetchall()

    cur.close()


    result=[]


    for bug in bugs:

        result.append({

            "bug_id":bug[0],
            "title":bug[1],
            "description":bug[2],
            "priority":bug[3],
            "status":bug[4],
            "project_id":bug[5],
            "assigned_to":bug[6]

        })


    return {
        "bugs":result
    },200
@app.route("/api/bugs/<int:bug_id>", methods=["PUT"])
@jwt_required()
def update_bug_status(bug_id):

    data = request.get_json()

    status = data.get("status")


    cur = mysql.connection.cursor()

    cur.execute(
        """
        UPDATE bugs 
        SET status=%s
        WHERE bug_id=%s
        """,
        (status, bug_id)
    )


    mysql.connection.commit()

    cur.close()


    return {
        "message":"Status Updated"
    },200
@app.route("/api/bugs/<int:bug_id>", methods=["DELETE"])
@jwt_required()
def delete_bug(bug_id):

    cur = mysql.connection.cursor()

    cur.execute(
        "DELETE FROM bugs WHERE bug_id=%s",
        (bug_id,)
    )

    mysql.connection.commit()

    cur.close()


    return {
        "message":"Bug Deleted"
    },200
@app.route("/api/dashboard/charts", methods=["GET"])
@jwt_required()
def dashboard_charts():

    cur = mysql.connection.cursor()


    # Bug status count

    cur.execute("""
        SELECT status, COUNT(*)
        FROM bugs
        GROUP BY status
    """)

    status_data = cur.fetchall()



    # Priority count

    cur.execute("""
        SELECT priority, COUNT(*)
        FROM bugs
        GROUP BY priority
    """)

    priority_data = cur.fetchall()



    # Developer workload

    cur.execute("""
        SELECT 
        users.username,
        COUNT(bugs.bug_id)

        FROM users

        LEFT JOIN bugs

        ON users.user_id = bugs.assigned_to

        GROUP BY users.username

    """)


    developer_data = cur.fetchall()


    cur.close()



    return {

        "status": [
            {
                "name": row[0],
                "value": row[1]
            }

            for row in status_data
        ],


        "priority":[

            {
                "name":row[0],
                "value":row[1]
            }

            for row in priority_data

        ],


        "developers":[

            {
                "name":row[0],
                "value":row[1]
            }

            for row in developer_data

        ]

    },200
if __name__ == "__main__":
    app.run(debug=True)