from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import mysql

items_bp = Blueprint("items", __name__)


@items_bp.route("/items", methods=["GET"])
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


@items_bp.route("/items", methods=["POST"])
@jwt_required()
def create_item():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    required_fields = ["type", "name", "rarity", "quantity", "price"]
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Données manquantes"}), 400

    if data["type"] not in ["card", "booster", "display"]:
        return jsonify({"error": "Type d'item invalide"}), 400

    try:
        rarity = int(data["rarity"])
        quantity = int(data["quantity"])
        price = float(data["price"])

        if not 1 <= rarity <= 4:
            return jsonify({"error": "Rareté invalide (doit être entre 1 et 4)"}), 400

        cur = mysql.connection.cursor()
        table_name = data["type"] + "s"

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


@items_bp.route("/items/<string:item_type>/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_item(item_type, item_id):
    try:
        current_user_id = int(get_jwt_identity())
        table_name = item_type + "s"
        cur = mysql.connection.cursor()

        cur.execute(
            f"DELETE FROM {table_name} WHERE id = %s AND user_id = %s",
            (item_id, current_user_id),
        )
        mysql.connection.commit()

        if cur.rowcount > 0:
            return jsonify({"message": "Item supprimé avec succès"}), 200
        else:
            return jsonify({"error": "Item non trouvé"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@items_bp.route("/items/<string:item_type>/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_item(item_type, item_id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"error": "Aucune donnée fournie"}), 400

    try:
        cur = mysql.connection.cursor()
        table_name = item_type + "s"

        # Vérification de l'existence de l'item
        cur.execute(
            f"SELECT * FROM {table_name} WHERE id = %s AND user_id = %s",
            (item_id, current_user_id),
        )
        if not cur.fetchone():
            return jsonify({"error": "Item non trouvé"}), 404

        # Construction de la requête de mise à jour
        update_fields = []
        values = []
        for key, value in data.items():
            if key in ["name", "rarity", "quantity", "price"]:
                update_fields.append(f"{key} = %s")
                values.append(value)

        if not update_fields:
            return jsonify({"error": "Aucun champ valide à mettre à jour"}), 400

        values.extend([item_id, current_user_id])
        query = f"UPDATE {table_name} SET {', '.join(update_fields)} WHERE id = %s AND user_id = %s"

        cur.execute(query, values)
        mysql.connection.commit()

        return jsonify({"message": "Item mis à jour avec succès"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@items_bp.route("/collection/total", methods=["GET"])
@jwt_required()
def get_collection_total():
    current_user_id = int(get_jwt_identity())
    cur = mysql.connection.cursor()

    try:
        # Calcul du total pour les cartes
        cur.execute(
            "SELECT COUNT(*) as count, SUM(quantity) as total_quantity, COALESCE(SUM(price * quantity), 0) as total_value FROM cards WHERE user_id = %s",
            [current_user_id],
        )
        cards_result = cur.fetchone()

        # Calcul du total pour les boosters
        cur.execute(
            "SELECT COUNT(*) as count, SUM(quantity) as total_quantity, COALESCE(SUM(price * quantity), 0) as total_value FROM boosters WHERE user_id = %s",
            [current_user_id],
        )
        boosters_result = cur.fetchone()

        # Calcul du total pour les displays
        cur.execute(
            "SELECT COUNT(*) as count, SUM(quantity) as total_quantity, COALESCE(SUM(price * quantity), 0) as total_value FROM displays WHERE user_id = %s",
            [current_user_id],
        )
        displays_result = cur.fetchone()

        # Conversion des valeurs en float
        cards_value = float(cards_result[2])
        boosters_value = float(boosters_result[2])
        displays_value = float(displays_result[2])

        # Formatage des résultats selon la structure attendue par le frontend
        result = {
            "cards": {
                "count": int(cards_result[0] or 0),
                "quantity": int(cards_result[1] or 0),
                "value": cards_value,
            },
            "boosters": {
                "count": int(boosters_result[0] or 0),
                "quantity": int(boosters_result[1] or 0),
                "value": boosters_value,
            },
            "displays": {
                "count": int(displays_result[0] or 0),
                "quantity": int(displays_result[1] or 0),
                "value": displays_value,
            },
            "total_value": cards_value + boosters_value + displays_value,
        }

        return jsonify(result)

    except Exception as e:
        print(f"Erreur dans get_collection_total: {str(e)}")
        return jsonify({"error": str(e)}), 500
