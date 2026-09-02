from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask import Flask, request, send_from_directory,jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mysqldb import MySQL
from dotenv import load_dotenv
from google import genai
from google.genai import types
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta

from config import mysql
from werkzeug.utils import secure_filename
from pinecone import Pinecone
from flasgger import Swagger

# Load Environment Variables
load_dotenv()

# Create Flask App
app = Flask(__name__)
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Bug Tracker API",
        "description": "REST API documentation for the AI Bug Tracker",
        "version": "1.0.0"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Enter: Bearer <JWT token>"
        }
    }
})
UPLOAD_FOLDER = "uploads"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

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
def get_current_user_role():
    email = get_jwt_identity()

    cur = mysql.connection.cursor()

    cur.execute(
        "SELECT role FROM users WHERE email=%s",
        (email,)
    )

    user = cur.fetchone()

    cur.close()

    if not user:
        return None

    return user[0]


def require_role(allowed_roles):

    role = get_current_user_role()

    if role not in allowed_roles:
        return False, {
            "message": "Access denied. Required role: " +
                       ", ".join(allowed_roles)
        }, 403

    return True, None, None

# Gemini AI
client = None
def generate_embedding(text):
    gemini_api_key = os.getenv("GEMINI_API_KEY")

    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not configured")

    client = genai.Client(api_key=gemini_api_key)

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=768)
    )

    return response.embeddings[0].values
def generate_ai_response(prompt):
    gemini_api_key = os.getenv("GEMINI_API_KEY")

    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not configured")

    client = genai.Client(api_key=gemini_api_key)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text
# Pinecone
pinecone = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

print("Pinecone initialized successfully")
# Pinecone Index
index = pinecone.Index(PINECONE_INDEX_NAME)

print("Pinecone index connected successfully")
def store_bug_embedding(bug_id, title, description):
    text = f"{title}. {description}"

    embedding = generate_embedding(text)

    index.upsert(
        vectors=[
            {
                "id": str(bug_id),
                "values": embedding,
                "metadata": {
                    "bug_id": bug_id,
                    "title": title,
                    "description": description
                }
            }
        ]
    )
def find_similar_bugs(title, description):
    text = f"{title}. {description}"

    embedding = generate_embedding(text)

    results = index.query(
        vector=embedding,
        top_k=3,
        include_metadata=True
    )

    return results.matches
@app.route("/api/search-bugs", methods=["POST"])
@jwt_required()
def search_bugs():
    data = request.get_json()

    query = data.get("query", "").strip()

    if not query:
        return jsonify({
            "message": "Search query is required"
        }), 400

    try:
        # Convert user's question into an embedding
        query_embedding = generate_embedding(query)

        # Search Pinecone for similar bugs
        results = index.query(
            vector=query_embedding,
            top_k=5,
            include_metadata=True
        )
        matches = []

        for match in results.matches:

    # Only return reasonably similar bugs
            if match.score >= 0.70:
                matches.append({
                    "bug_id": match.metadata.get("bug_id"),
                    "title": match.metadata.get("title"),
                    "description": match.metadata.get("description"),
                    "score": match.score
                })

        

        return jsonify({
            "results": matches
        }), 200

    except Exception as e:
        print("Pinecone search error:", e)

        return jsonify({
            "message": "Search failed",
            "error": str(e)
        }), 500


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
def error_response(message, status_code):
    return {
        "error": message,
        "status": status_code
    }, status_code
@app.route("/api/login", methods=["POST"])
def login():
    """
    Login User
    ---
    tags:
      - Authentication
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: user@example.com
            password:
              type: string
              example: password123
    responses:
      200:
        description: Login successful
      401:
        description: Invalid email or password
    """
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
    """
    Get Dashboard Summary
    ---
    tags:
      - Dashboard
    security:
      - Bearer: []
    responses:
      200:
        description: Dashboard statistics retrieved successfully
      401:
        description: Authentication required
      403:
        description: Access denied
    """

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

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

    # In Progress Bugs
    cur.execute("SELECT COUNT(*) FROM bugs WHERE status='In Progress'")
    in_progress_bugs = cur.fetchone()[0]

    # In Review Bugs
    cur.execute("SELECT COUNT(*) FROM bugs WHERE status='In Review'")
    in_review_bugs = cur.fetchone()[0]

    # Resolved Bugs
    cur.execute("SELECT COUNT(*) FROM bugs WHERE status='Resolved'")
    resolved_bugs = cur.fetchone()[0]

    # Closed Bugs
    cur.execute("SELECT COUNT(*) FROM bugs WHERE status='Closed'")
    closed_bugs = cur.fetchone()[0]

    cur.close()

    return {
        "total_users": total_users,
        "total_projects": total_projects,
        "total_bugs": total_bugs,
        "open_bugs": open_bugs,
        "in_progress_bugs": in_progress_bugs,
        "in_review_bugs": in_review_bugs,
        "resolved_bugs": resolved_bugs,
        "closed_bugs": closed_bugs
    }, 200
@app.route("/api/projects", methods=["POST"])
@jwt_required()
def create_project():
    """
    Create a New Project
    ---
    tags:
      - Projects
    security:
      - Bearer: []
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
          properties:
            name:
              type: string
              example: Bug Tracker Project
    responses:
      201:
        description: Project created successfully
      400:
        description: Invalid input
      401:
        description: Authentication required
      403:
        description: Manager access required
    """

    # Get logged-in user's email
    email = get_jwt_identity()

    cur = mysql.connection.cursor()

    # Get user's role
    cur.execute(
        """
        SELECT role
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cur.fetchone()

    if not user:

        cur.close()

        return error_response("User not found", 404)

    role = user[0]

    # Only Manager can create projects
    if role != "Manager":

        cur.close()

        return {
            "message": "Access denied. Manager role required."
        }, 403

    # Get project data
    data = request.get_json()

    project_name = data.get("project_name")
    description = data.get("description")

    # Create project
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
    """
    Get All Projects
    ---
    tags:
      - Projects
    security:
      - Bearer: []
    responses:
      200:
        description: List of all projects
      401:
        description: Authentication required
      403:
        description: Access denied
    """

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            project_id,
            project_name,
            description
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
    """
    Get Project by ID
    ---
    tags:
      - Projects
    security:
      - Bearer: []
    parameters:
      - in: path
        name: project_id
        required: true
        type: integer
        example: 1
    responses:
      200:
        description: Project details retrieved successfully
      401:
        description: Authentication required
      403:
        description: Access denied
      404:
        description: Project not found
    """

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

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
        return error_response("Project not found", 404)
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
        """
    Get All Users
    ---
    tags:
      - Users
    security:
      - Bearer: []
    responses:
      200:
        description: List of all users
      401:
        description: Authentication required
      403:
        description: Manager access required
        """
        allowed, error, status_code = require_role(["Manager"])

        if not allowed:
            return error, status_code

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
        allowed, error, status_code = require_role(
        ["Tester", "Manager"]
    )

        if not allowed:
            return error, status_code

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
@app.route("/api/auto_triage", methods=["POST"])
@jwt_required()
def auto_triage():

    allowed, error, status_code = require_role(
        ["Tester", "Manager"]
    )

    if not allowed:
        return error, status_code

    data = request.get_json()
    description = data.get("description")

    if not description or not description.strip():
        return {
            "message": "Bug description is required"
        }, 400

    prompt = f"""
You are a software QA engineer.

Analyze the following bug description and automatically classify it.

Bug Description:
{description}

Return ONLY valid JSON in exactly this format:

{{
    "category": "one short category",
    "severity": "Critical",
    "priority": "High"
}}

Severity MUST be exactly one of:
Critical
High
Medium
Low

Priority MUST be exactly one of:
Critical
High
Medium
Low

Choose severity based on the technical impact of the bug.

Choose priority based on how urgently the bug should be fixed.

Choose a suitable category such as:
UI
Authentication
Performance
Database
API
File Upload
Security
Functional
Other

Do not add any explanation outside the JSON.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    import json

    text = response.text.strip()

    try:
        result = json.loads(text)

    except Exception as e:

        print("AI RAW RESPONSE:", response.text)
        print("JSON ERROR:", e)

        return {
            "message": "AI returned an invalid response"
        }, 500

    return {
        "category": result.get("category"),
        "severity": result.get("severity"),
        "priority": result.get("priority")
    }, 200

@app.route("/api/bugs", methods=["POST"])
@jwt_required()
def create_bug():
    """
    Create a New Bug
    ---
    tags:
      - Bugs
    security:
      - Bearer: []
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - title
            - description
            - priority
            - severity
            - project_id
          properties:
            title:
              type: string
              example: Login button not working
            description:
              type: string
              example: Login button does not respond when clicked
            priority:
              type: string
              enum:
                - Low
                - Medium
                - High
              example: High
            severity:
              type: string
              enum:
                - Low
                - Medium
                - High
                - Critical
              example: High
            project_id:
              type: integer
              example: 1
            assigned_to:
              type: integer
              example: 2
            category:
              type: string
              example: UI
    responses:
      201:
        description: Bug created successfully
      400:
        description: Invalid input
      401:
        description: Authentication required
      403:
        description: Access denied
    """
    allowed, error, status_code = require_role(
        ["Tester", "Manager"]
    )

    if not allowed:
        return error, status_code

    data = request.get_json()

    if not data:
        return {
            "message": "Request body must be JSON"
        }, 400

    title = data.get("title")
    description = data.get("description")
    priority = data.get("priority")
    severity = data.get("severity")
    project_id = data.get("project_id")
    assigned_to = data.get("assigned_to")
    category = data.get("category")

    # Required field validation
    if not title or not title.strip():
        return {
            "message": "Title is required"
        }, 400

    if not description or not description.strip():
        return {
            "message": "Description is required"
        }, 400

    if not priority:
        return {
            "message": "Priority is required"
        }, 400

    if not severity:
        return {
            "message": "Severity is required"
        }, 400

    if not project_id:
        return {
            "message": "Project ID is required"
        }, 400

    # Allowed values validation
    allowed_priorities = ["Low", "Medium", "High"]

    if priority not in allowed_priorities:
        return {
            "message": "Invalid priority",
            "allowed_values": allowed_priorities
        }, 400

    allowed_severities = ["Low", "Medium", "High", "Critical"]

    if severity not in allowed_severities:
        return {
            "message": "Invalid severity",
            "allowed_values": allowed_severities
        }, 400

    similar_bugs = find_similar_bugs(title, description)

    print("========== PINECONE DUPLICATE CHECK ==========")

    for match in similar_bugs:
        print("SCORE:", match.score)
        print("TITLE:", match.metadata.get("title"))
        print("DESCRIPTION:", match.metadata.get("description"))
        print("---------------------------------------------")

        if match.score >= 0.85:
            return {
                "duplicate": True,
                "message": "A similar bug already exists",
                "similar_bug": match.metadata
                }, 409

    cur = mysql.connection.cursor()

    cur.execute(
        """
        INSERT INTO bugs
        (
            title,
            description,
            priority,
            severity,
            category,
            project_id,
            assigned_to
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            title,
            description,
            priority,
            severity,
            category,
            project_id,
            assigned_to
        )
    )

    bug_id = cur.lastrowid
    store_bug_embedding(
    bug_id,
    title,
    description
)

    user_email = get_jwt_identity()

    cur.execute(
        """
        SELECT user_id
        FROM users
        WHERE email = %s
        """,
        (user_email,)
    )

    user = cur.fetchone()

    if user:
        user_id = user[0]

        cur.execute(
            """
            INSERT INTO activity_history
            (
                bug_id,
                user_id,
                action,
                details
            )
            VALUES(%s,%s,%s,%s)
            """,
            (
                bug_id,
                user_id,
                "Bug Created",
                "Bug was created"
            )
        )

    mysql.connection.commit()

    cur.close()

    return {
        "message": "Bug Reported Successfully"
    }, 201

@app.route("/api/bugs", methods=["GET"])
@jwt_required()
def get_bugs():
    """
    Get All Bugs
    ---
    tags:
      - Bugs
    security:
      - Bearer: []
    responses:
      200:
        description: List of all bugs
      401:
        description: Authentication required
    """

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            bugs.bug_id,
            bugs.title,
            bugs.description,
            bugs.priority,
            bugs.severity,
            bugs.status,
            bugs.project_id,
            users.username,
            bugs.created_at,
            bugs.resolved_at
        FROM bugs
        LEFT JOIN users
            ON bugs.assigned_to = users.user_id
        ORDER BY bugs.bug_id DESC
    """)

    bugs = cur.fetchall()

    cur.close()

    result = []

    for bug in bugs:
        result.append({
            "bug_id": bug[0],
            "title": bug[1],
            "description": bug[2],
            "priority": bug[3],
            "severity": bug[4],
            "status": bug[5],
            "project_id": bug[6],
            "assigned_to": bug[7],
            "created_at": str(bug[8]) if bug[8] else None,
            "resolved_at": str(bug[9]) if bug[9] else None
        })

    return {
        "bugs": result
    }, 200
@app.route("/api/bugs/<int:bug_id>", methods=["PUT"])
@jwt_required()
def update_bug_status(bug_id):
    """
    Update Bug Status
    ---
    tags:
      - Bugs
    security:
      - Bearer: []
    parameters:
      - in: path
        name: bug_id
        required: true
        type: integer
        example: 1
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - status
          properties:
            status:
              type: string
              enum:
                - In Progress
                - In Review
                - Resolved
              example: In Progress
    responses:
      200:
        description: Bug status updated successfully
      400:
        description: Invalid status or transition
      401:
        description: Authentication required
      403:
        description: Access denied
      404:
        description: Bug not found
    """

    allowed, error, status_code = require_role(
        ["Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    data = request.get_json()

    new_status = data.get("status")

    if not new_status:
        return {
            "message": "Status is required"
        }, 400

    cur = mysql.connection.cursor()

    # Get current status
    cur.execute(
        """
        SELECT status
        FROM bugs
        WHERE bug_id=%s
        """,
        (bug_id,)
    )

    bug = cur.fetchone()

    if not bug:
        cur.close()
        return error_response("Bug not found", 404)

    old_status = bug[0]

    allowed_transitions = {
        "Open": ["In Progress"],
        "In Progress": ["In Review"],
        "In Review": ["Resolved"],
        "Resolved": []
    }

    if new_status not in allowed_transitions.get(old_status, []):
        cur.close()
        return {
            "message": f"Invalid status transition: {old_status} → {new_status}"
        }, 400

    # Get logged-in user's email
    email = get_jwt_identity()

    # Get user ID
    cur.execute(
        """
        SELECT user_id
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cur.fetchone()

    if not user:
        cur.close()
        return error_response("User not found", 404)

    user_id = user[0]

    
    # Update bug status
    if new_status == "Resolved":

        cur.execute(
            """
            UPDATE bugs
            SET status=%s,
                resolved_at=CURRENT_TIMESTAMP
            WHERE bug_id=%s
            """,
            (new_status, bug_id)
        )

    else:

        cur.execute(
            """
            UPDATE bugs
            SET status=%s
            WHERE bug_id=%s
            """,
            (new_status, bug_id)
        )
    # Add activity history
    cur.execute(
        """
        INSERT INTO activity_history
        (
            bug_id,
            user_id,
            action,
            details
        )
        VALUES(%s,%s,%s,%s)
        """,
        (
            bug_id,
            user_id,
            "Status Changed",
            f"{old_status} -> {new_status}"
        )
    )

    mysql.connection.commit()

    cur.close()

    return {
        "message": "Status Updated"
    }, 200
@app.route("/api/bugs/<int:bug_id>", methods=["DELETE"])
@jwt_required()
def delete_bug(bug_id):

    allowed, error, status_code = require_role(["Manager"])

    if not allowed:
        return error, status_code

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
@app.route("/api/bugs/<int:bug_id>/attachments", methods=["POST"])
@jwt_required()
def upload_attachment(bug_id):
        allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

        if not allowed:
            return error, status_code

        if "file" not in request.files:
            return {
                "message": "No file provided"
            }, 400

        file = request.files["file"]

        if file.filename == "":
            return {
                "message": "No file selected"
            }, 400

    # Check whether bug exists
        cur = mysql.connection.cursor()

        cur.execute(
            """
            SELECT bug_id
            FROM bugs
            WHERE bug_id=%s
            """,
            (bug_id,)
        )

        bug = cur.fetchone()

        if not bug:
            cur.close()

            return error_response("Bug not found", 404)

    # Get logged-in user
        email = get_jwt_identity()

        cur.execute(
            """
            SELECT user_id
            FROM users
            WHERE email=%s
            """,
            (email,)
        )

        user = cur.fetchone()

        if not user:
            cur.close()

            return error_response("User not found", 404)

        user_id = user[0]

    # Make filename safe
        filename = secure_filename(file.filename)

    # Save file
        file_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )

        file.save(file_path)

    # Save file information in database
        cur.execute(
            """
            INSERT INTO attachments
            (
                bug_id,
                user_id,
                file_name,
                file_path
            )
            VALUES(%s,%s,%s,%s)
            """,
            (
                bug_id,
                user_id,
                filename,
                file_path
            )
        )

        
        mysql.connection.commit()

        cur.close()

        return {
            "message": "File uploaded successfully",
            "file_name": filename
        }, 201
@app.route("/api/bugs/<int:bug_id>/activity", methods=["GET"])
@jwt_required()
def get_activity_history(bug_id):
        allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

        if not allowed:
            return error, status_code

        cur = mysql.connection.cursor()

        cur.execute("""
            SELECT
                activity_history.activity_id,
                activity_history.action,
                activity_history.details,
                activity_history.created_at,
                users.username
            FROM activity_history
            LEFT JOIN users
            ON activity_history.user_id = users.user_id
            WHERE activity_history.bug_id=%s
            ORDER BY activity_history.created_at DESC
        """, (bug_id,))

        activities = cur.fetchall()

        cur.close()

        result = []

        for activity in activities:

            result.append({
                "activity_id": activity[0],
                "action": activity[1],
                "details": activity[2],
                "created_at": activity[3],
                "username": activity[4]
            })

        return {
            "activities": result
        }, 200
@app.route("/api/dashboard/charts", methods=["GET"])
@jwt_required()
def dashboard_charts():
    """
    Get Dashboard Chart Data
    ---
    tags:
      - Dashboard
    security:
      - Bearer: []
    responses:
      200:
        description: Dashboard chart data retrieved successfully
      401:
        description: Authentication required
      403:
        description: Access denied
    """

    cur = mysql.connection.cursor()

    # -----------------------------
    # Bug status count
    # -----------------------------
    cur.execute("""
        SELECT status, COUNT(*)
        FROM bugs
        GROUP BY status
    """)

    status_data = cur.fetchall()


    # -----------------------------
    # Priority count
    # -----------------------------
    cur.execute("""
        SELECT priority, COUNT(*)
        FROM bugs
        GROUP BY priority
    """)

    priority_data = cur.fetchall()


    # -----------------------------
    # Severity count
    # -----------------------------
    cur.execute("""
        SELECT severity, COUNT(*)
        FROM bugs
        GROUP BY severity
    """)

    severity_data = cur.fetchall()


    # -----------------------------
    # Category count
    # -----------------------------
    cur.execute("""
        SELECT category, COUNT(*)
        FROM bugs
        WHERE category IS NOT NULL
        AND category != ''
        GROUP BY category
    """)

    category_data = cur.fetchall()


    # -----------------------------
    # Defect trend by date
    # -----------------------------
    cur.execute("""
        SELECT DATE(created_at), COUNT(*)
        FROM bugs
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
    """)

    trend_data = cur.fetchall()


    # -----------------------------
    # Developer workload
    # -----------------------------
    cur.execute("""
        SELECT u.username, COUNT(b.bug_id)
        FROM bugs b
        JOIN users u
            ON b.assigned_to = u.user_id
        WHERE b.assigned_to IS NOT NULL
        GROUP BY b.assigned_to, u.username
        ORDER BY COUNT(b.bug_id) DESC
    """)

    developer_workload_data = cur.fetchall()
    # Average resolution time
    cur.execute("""
        SELECT AVG(
            TIMESTAMPDIFF(
                HOUR,
                created_at,
                resolved_at
            )
        )
        FROM bugs
        WHERE resolved_at IS NOT NULL
    """)

    average_resolution_time = cur.fetchone()[0]

    # Close cursor AFTER all queries
    cur.close()


    # -----------------------------
    # Convert data to JSON format
    # -----------------------------

    status = [
        {
            "name": row[0],
            "value": row[1]
        }
        for row in status_data
    ]


    priority = [
        {
            "name": row[0],
            "value": row[1]
        }
        for row in priority_data
    ]


    severity = [
        {
            "name": row[0],
            "value": row[1]
        }
        for row in severity_data
    ]


    category = [
        {
            "name": row[0],
            "value": row[1]
        }
        for row in category_data
    ]


    trend = [
        {
            "date": str(row[0]),
            "value": row[1]
        }
        for row in trend_data
    ]


    developer_workload = [
        {
            "name": row[0],
            "value": row[1]
        }
        for row in developer_workload_data
    ]


    # -----------------------------
    # Final response
    # -----------------------------

    return jsonify({

        "status": status,

        "priority": priority,

        "severity": severity,

        "category": category,

        "trend": trend,

        "developer_workload": developer_workload,
        "average_resolution_time":
            round(float(average_resolution_time), 2)
            if average_resolution_time is not None else 0
        }), 200
@app.route("/api/bugs/<int:bug_id>/comments", methods=["GET"])
@jwt_required()
def get_comments(bug_id):
    allowed, error, status_code = require_role(
    ["Tester", "Developer", "Manager"]
)

    if not allowed:
        return error, status_code

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            comments.comment_id,
            comments.comment,
            comments.created_at,
            users.user_id,
            users.username
        FROM comments
        JOIN users
            ON comments.user_id = users.user_id
        WHERE comments.bug_id = %s
        ORDER BY comments.created_at ASC
    """, (bug_id,))

    comments = cur.fetchall()

    cur.close()

    result = []

    for item in comments:

        result.append({
            "comment_id": item[0],
            "comment": item[1],
            "created_at": item[2],
            "user_id": item[3],
            "username": item[4]
        })

    return {
        "comments": result
    }, 200
@app.route("/api/bugs/<int:bug_id>/comments", methods=["POST"])
@jwt_required()
def add_comment(bug_id):

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    data = request.get_json()

    comment = data.get("comment")

    if not comment or not comment.strip():
        return {
            "message": "Comment cannot be empty"
        }, 400

    email = get_jwt_identity()

    cur = mysql.connection.cursor()

    # Find logged-in user
    cur.execute(
        """
        SELECT user_id
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cur.fetchone()

    if not user:
        cur.close()
        return error_response("User not found", 404)

    user_id = user[0]

    # Check bug exists
    cur.execute(
        """
        SELECT bug_id
        FROM bugs
        WHERE bug_id=%s
        """,
        (bug_id,)
    )

    bug = cur.fetchone()

    if not bug:
        cur.close()
        return error_response("Bug not found", 404)

    # Insert comment
    cur.execute(
        """
        INSERT INTO comments
        (
            bug_id,
            user_id,
            comment
        )
        VALUES(%s,%s,%s)
        """,
        (
            bug_id,
            user_id,
            comment.strip()
        )
    )
    

    # Add activity history
    cur.execute(
        """
        INSERT INTO activity_history
        (
            bug_id,
            user_id,
            action,
            details
        )
        VALUES(%s,%s,%s,%s)
        """,
            (
            bug_id,
            user_id,
            "Comment Added",
            "Added a comment"
        )
    )

    mysql.connection.commit()
    cur.close()

    return {
        "message": "Comment added successfully"
    }, 201
@app.route("/api/bugs/<int:bug_id>/ai-resolution", methods=["GET"])
@jwt_required()
def ai_resolution(bug_id):

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    cur = mysql.connection.cursor()

    cur.execute(
        """
        SELECT title, description
        FROM bugs
        WHERE bug_id=%s
        """,
        (bug_id,)
    )

    bug = cur.fetchone()

    cur.close()

    if not bug:
         return error_response("Bug not found", 404)

    title = bug[0]
    description = bug[1]

    prompt = f"""
You are a software debugging assistant.

Analyze the following bug:

Bug Title:
{'title'}

Bug Description:
{'description'}

Generate a SHORT and CLEAR debugging solution.

IMPORTANT RULES:
- Keep the answer concise.
- Do NOT write long paragraphs.
- Do NOT repeat information.
- Each point should be one short sentence.
- Use simple technical language.
- Give only the most useful information.
- Maximum 2 points for Root Cause.
- Maximum 3 points for Investigation.
- Maximum 4 steps for Debugging Steps.
- Maximum 3 points for Resolution.
- Maximum 2 points for Prevention.
- Do not add any extra sections.
- Do not add an introduction or conclusion.
- Do not use Markdown headings such as ###.
- Follow this exact order.

FORMAT:

ROOT CAUSE
• Short point
• Short point

INVESTIGATION
• Short point
• Short point
• Short point

DEBUGGING STEPS
1. Short step
2. Short step
3. Short step
4. Short step

RESOLUTION
• Short point
• Short point

PREVENTION
• Short point
• Short point
"""
    try:

        response = generate_ai_response(prompt)

        if not response:
            return {
                "message": "AI returned an empty response"
            }, 500

        return {
            "bug_id": bug_id,
            "title": title,
            "resolution_assistance": response
        }, 200

    except Exception as e:

        print("====================================")
        print("AI RESOLUTION ERROR")
        print("====================================")
        print(str(e))
        print("====================================")

        return {
            "message": "AI resolution generation failed",
            "error": str(e)
        }, 500
@app.route("/api/sprints", methods=["GET"])
@jwt_required()
def get_sprints():

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            sprint_id,
            sprint_name,
            description,
            start_date,
            end_date,
            created_at
        FROM sprints
        ORDER BY sprint_id DESC
    """)

    sprints = cur.fetchall()

    cur.close()

    result = []

    for sprint in sprints:

        result.append({
            "sprint_id": sprint[0],
            "sprint_name": sprint[1],
            "description": sprint[2],
            "start_date": str(sprint[3]) if sprint[3] else None,
            "end_date": str(sprint[4]) if sprint[4] else None,
            "created_at": str(sprint[5]) if sprint[5] else None
        })

    return {
        "sprints": result
    }, 200
@app.route("/api/sprints", methods=["POST"])
@jwt_required()
def create_sprint():

    allowed, error, status_code = require_role(
        ["Manager"]
    )

    if not allowed:
        return error, status_code

    data = request.get_json()

    sprint_name = data.get("sprint_name")
    description = data.get("description")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not sprint_name:
        return {
            "message": "Sprint name is required"
        }, 400

    cur = mysql.connection.cursor()

    cur.execute("""
        INSERT INTO sprints
        (
            sprint_name,
            description,
            start_date,
            end_date
        )
        VALUES(%s,%s,%s,%s)
    """, (
        sprint_name,
        description,
        start_date,
        end_date
    ))

    mysql.connection.commit()

    sprint_id = cur.lastrowid

    cur.close()

    return {
        "message": "Sprint created successfully",
        "sprint_id": sprint_id
    }, 201
@app.route("/api/bugs/<int:bug_id>/sprint", methods=["PUT"])
@jwt_required()
def assign_bug_to_sprint(bug_id):

    allowed, error, status_code = require_role(
        ["Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    data = request.get_json()

    sprint_id = data.get("sprint_id")

    if not sprint_id:
        return {
            "message": "Sprint ID is required"
        }, 400

    cur = mysql.connection.cursor()

    # Check bug exists
    cur.execute("""
        SELECT bug_id
        FROM bugs
        WHERE bug_id=%s
    """, (bug_id,))

    bug = cur.fetchone()

    if not bug:
        cur.close()

        return error_response("Bug not found", 404)

    # Check sprint exists
    cur.execute("""
        SELECT sprint_id
        FROM sprints
        WHERE sprint_id=%s
    """, (sprint_id,))

    sprint = cur.fetchone()

    if not sprint:
        cur.close()

        return error_response("Sprint not found", 404)

    # Assign bug to sprint
    cur.execute("""
        UPDATE bugs
        SET sprint_id=%s
        WHERE bug_id=%s
    """, (
        sprint_id,
        bug_id
    ))

    mysql.connection.commit()

    cur.close()

    return {
        "message": "Bug assigned to sprint successfully"
    }, 200
@app.route("/api/sprints/<int:sprint_id>/bugs", methods=["GET"])
@jwt_required()
def get_sprint_bugs(sprint_id):

    allowed, error, status_code = require_role(
        ["Tester", "Developer", "Manager"]
    )

    if not allowed:
        return error, status_code

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            bugs.bug_id,
            bugs.title,
            bugs.description,
            bugs.priority,
            bugs.severity,
            bugs.status,
            users.username
        FROM bugs
        LEFT JOIN users
            ON bugs.assigned_to = users.user_id
        WHERE bugs.sprint_id=%s
        ORDER BY bugs.bug_id DESC
    """, (sprint_id,))

    bugs = cur.fetchall()

    cur.close()

    result = []

    for bug in bugs:

        result.append({
            "bug_id": bug[0],
            "title": bug[1],
            "description": bug[2],
            "priority": bug[3],
            "severity": bug[4],
            "status": bug[5],
            "assigned_to": bug[6]
        })

    return {
        "bugs": result
    }, 200
if __name__ == "__main__":
    app.run(debug=True)