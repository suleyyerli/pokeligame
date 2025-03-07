from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from .. import mysql

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not all(k in data for k in ["email", "password", "username"]):
        return jsonify({"error": "Données manquantes"}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", [data["email"]])
    if cur.fetchone() is not None:
        return jsonify({"error": "Email déjà utilisé"}), 409

    hashed_password = generate_password_hash(data["password"])

    cur.execute(
        "INSERT INTO users (email, password, username) VALUES (%s, %s, %s)",
        [data["email"], hashed_password, data["username"]],
    )
    mysql.connection.commit()

    return jsonify({"message": "Inscription réussie"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not all(k in data for k in ["email", "password"]):
        return jsonify({"error": "Email et mot de passe requis"}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", [data["email"]])
    user = cur.fetchone()

    if user and check_password_hash(user[2], data["password"]):
        access_token = create_access_token(identity=str(user[0]))
        return (
            jsonify({"token": access_token, "user_id": user[0], "username": user[3]}),
            200,
        )

    return jsonify({"error": "Email ou mot de passe incorrect"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Déconnexion réussie"}), 200
