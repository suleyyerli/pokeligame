from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

app = Flask(__name__)
# Configuration CORS simplifiée
CORS(
    app,
    origins=["*"],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# Clé secrète pour JWT
app.config["JWT_SECRET_KEY"] = "votre-cle-secrete-super-securisee"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(days=1)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

# Configuration MySQL
app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"  # Ton utilisateur MySQL
app.config["MYSQL_PASSWORD"] = "sololeveling"  # Ton mot de passe MySQL
app.config["MYSQL_DB"] = "pokeligame"

mysql = MySQL(app)
jwt = JWTManager(app)


# Route d'accueil
@app.route("/")
def home():
    return "Bienvenue sur le backend Pokeligame !"


# Route pour l'inscription
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # Vérification des données requises
    if not all(k in data for k in ["email", "password", "username"]):
        return jsonify({"error": "Données manquantes"}), 400

    # Vérification si l'email existe déjà
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", [data["email"]])
    if cur.fetchone() is not None:
        return jsonify({"error": "Email déjà utilisé"}), 409

    # Hashage du mot de passe
    hashed_password = generate_password_hash(data["password"])

    # Insertion du nouvel utilisateur
    cur.execute(
        "INSERT INTO users (email, password, username) VALUES (%s, %s, %s)",
        [data["email"], hashed_password, data["username"]],
    )
    mysql.connection.commit()

    return jsonify({"message": "Inscription réussie"}), 201


# Route pour la connexion
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # Vérification des données requises
    if not all(k in data for k in ["email", "password"]):
        return jsonify({"error": "Email et mot de passe requis"}), 400

    # Recherche de l'utilisateur
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", [data["email"]])
    user = cur.fetchone()

    # Vérification du mot de passe
    if user and check_password_hash(
        user[2], data["password"]
    ):  # user[2] est le mot de passe hashé
        # Création du token avec l'ID converti en string
        access_token = create_access_token(
            identity=str(user[0])
        )  # Conversion en string
        return (
            jsonify({"token": access_token, "user_id": user[0], "username": user[3]}),
            200,
        )

    return jsonify({"error": "Email ou mot de passe incorrect"}), 401


# Modification de la route get_cards pour récupérer tous les items
@app.route("/items", methods=["GET"])
@jwt_required()
def get_items():
    current_user_id = int(get_jwt_identity())
    cur = mysql.connection.cursor()

    # Récupération des cartes
    cur.execute(
        "SELECT 'card' as type, id, name, rarity, quantity, price FROM cards WHERE user_id = %s",
        [current_user_id],
    )
    cards = cur.fetchall()

    # Récupération des boosters
    cur.execute(
        "SELECT 'booster' as type, id, name, rarity, quantity, price FROM boosters WHERE user_id = %s",
        [current_user_id],
    )
    boosters = cur.fetchall()

    # Récupération des displays
    cur.execute(
        "SELECT 'display' as type, id, name, rarity, quantity, price FROM displays WHERE user_id = %s",
        [current_user_id],
    )
    displays = cur.fetchall()

    # Combinaison des résultats
    all_items = cards + boosters + displays

    # Formatage des résultats
    result = [
        {
            "type": item[0],
            "id": item[1],
            "name": item[2],
            "rarity": item[3],
            "quantity": item[4],
            "price": item[5],
        }
        for item in all_items
    ]

    return jsonify(result)


# Route pour la déconnexion
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Déconnexion réussie"}), 200


# Route pour la création d'un item (carte/display/booster)
@app.route("/items", methods=["POST"])
@jwt_required()
def create_item():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    # Vérification des données requises
    required_fields = ["type", "name", "rarity", "quantity", "price"]
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Données manquantes"}), 400

    # Vérification du type d'item
    if data["type"] not in ["card", "booster", "display"]:
        return jsonify({"error": "Type d'item invalide"}), 400

    try:
        # Conversion des valeurs numériques
        rarity = int(data["rarity"])
        quantity = int(data["quantity"])
        price = float(data["price"])

        # Vérification de la rareté
        if not 1 <= rarity <= 4:
            return jsonify({"error": "Rareté invalide (doit être entre 1 et 4)"}), 400

        cur = mysql.connection.cursor()

        # Sélection de la table en fonction du type
        table_name = data["type"] + "s"  # cards, boosters ou displays

        # Insertion de l'item
        cur.execute(
            f"INSERT INTO {table_name} (user_id, name, rarity, quantity, price) VALUES (%s, %s, %s, %s, %s)",
            [current_user_id, data["name"], rarity, quantity, price],
        )
        mysql.connection.commit()

        return (
            jsonify(
                {
                    "message": f'{data["type"]} ajouté avec succès',
                    "item": {
                        "type": data["type"],
                        "name": data["name"],
                        "rarity": rarity,
                        "quantity": quantity,
                        "price": price,
                    },
                }
            ),
            201,
        )

    except ValueError:
        return jsonify({"error": "Valeurs numériques invalides"}), 400
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la création : {str(e)}"}), 500


# Suppression d'un item
@app.route("/items/<string:item_type>/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_item(item_type, item_id):
    print(f"DELETE request received for {item_type}/{item_id}")
    try:
        current_user_id = int(get_jwt_identity())
        print(f"User {current_user_id} attempting to delete {item_type}/{item_id}")

        table_name = item_type + "s"
        cur = mysql.connection.cursor()

        # Vérification et suppression
        cur.execute(
            f"DELETE FROM {table_name} WHERE id = %s AND user_id = %s",
            (item_id, current_user_id),
        )
        mysql.connection.commit()

        if cur.rowcount > 0:
            print(f"Successfully deleted {item_type}/{item_id}")
            return jsonify({"message": "Item supprimé avec succès"}), 200
        else:
            print(f"No item found to delete {item_type}/{item_id}")
            return jsonify({"error": "Item non trouvé"}), 404

    except Exception as e:
        print(f"Error during deletion: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Modification d'un item
@app.route("/items/<string:item_type>/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_item(item_type, item_id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    # Vérification du type d'item
    if item_type not in ["card", "booster", "display"]:
        return jsonify({"error": "Type d'item invalide"}), 400

    # Vérification des données requises
    required_fields = ["name", "rarity", "quantity", "price"]
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Données manquantes"}), 400

    try:
        # Conversion des valeurs numériques
        rarity = int(data["rarity"])
        quantity = int(data["quantity"])
        price = float(data["price"])

        # Vérification de la rareté
        if not 1 <= rarity <= 4:
            return jsonify({"error": "Rareté invalide (doit être entre 1 et 4)"}), 400

        table_name = item_type + "s"
        cur = mysql.connection.cursor()

        # Vérification si l'item appartient à l'utilisateur
        cur.execute(
            f"SELECT * FROM {table_name} WHERE id = %s AND user_id = %s",
            (item_id, current_user_id),
        )
        if cur.fetchone() is None:
            return jsonify({"error": "Item non trouvé ou non autorisé"}), 404

        # Mise à jour de l'item
        cur.execute(
            f"UPDATE {table_name} SET name = %s, rarity = %s, quantity = %s, price = %s WHERE id = %s",
            (data["name"], rarity, quantity, price, item_id),
        )
        mysql.connection.commit()

        return (
            jsonify(
                {
                    "message": "Item modifié avec succès",
                    "item": {
                        "id": item_id,
                        "type": item_type,
                        "name": data["name"],
                        "rarity": rarity,
                        "quantity": quantity,
                        "price": price,
                    },
                }
            ),
            200,
        )

    except ValueError:
        return jsonify({"error": "Valeurs numériques invalides"}), 400
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la modification : {str(e)}"}), 500


# Route pour obtenir le coût total de la collection
@app.route("/collection/total", methods=["GET"])
@jwt_required()
def get_collection_total():
    current_user_id = int(get_jwt_identity())
    cur = mysql.connection.cursor()

    # Initialisation du total
    total = {
        "cards": {"count": 0, "value": 0},
        "boosters": {"count": 0, "value": 0},
        "displays": {"count": 0, "value": 0},
        "total_value": 0,
    }

    # Calcul pour les cartes
    cur.execute(
        """
        SELECT COUNT(*) as count, SUM(quantity) as total_quantity, 
               SUM(quantity * price) as total_value 
        FROM cards 
        WHERE user_id = %s
    """,
        [current_user_id],
    )
    cards_result = cur.fetchone()
    if cards_result[2]:  # Si total_value n'est pas None
        total["cards"] = {
            "count": cards_result[0],
            "quantity": cards_result[1],
            "value": float(cards_result[2]),
        }
        total["total_value"] += float(cards_result[2])

    # Calcul pour les boosters
    cur.execute(
        """
        SELECT COUNT(*) as count, SUM(quantity) as total_quantity,
               SUM(quantity * price) as total_value 
        FROM boosters 
        WHERE user_id = %s
    """,
        [current_user_id],
    )
    boosters_result = cur.fetchone()
    if boosters_result[2]:  # Si total_value n'est pas None
        total["boosters"] = {
            "count": boosters_result[0],
            "quantity": boosters_result[1],
            "value": float(boosters_result[2]),
        }
        total["total_value"] += float(boosters_result[2])

    # Calcul pour les displays
    cur.execute(
        """
        SELECT COUNT(*) as count, SUM(quantity) as total_quantity,
               SUM(quantity * price) as total_value 
        FROM displays 
        WHERE user_id = %s
    """,
        [current_user_id],
    )
    displays_result = cur.fetchone()
    if displays_result[2]:  # Si total_value n'est pas None
        total["displays"] = {
            "count": displays_result[0],
            "quantity": displays_result[1],
            "value": float(displays_result[2]),
        }
        total["total_value"] += float(displays_result[2])

    return jsonify(total)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
