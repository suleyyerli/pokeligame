from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Ton utilisateur MySQL
app.config['MYSQL_PASSWORD'] = 'sololeveling'  # Ton mot de passe MySQL
app.config['MYSQL_DB'] = 'pokeligame'

mysql = MySQL(app)

# Route d'accueil
@app.route('/')
def home():
    return "Bienvenue sur le backend Pokeligame !"

# Route pour récupérer toutes les cartes
@app.route('/cards', methods=['GET'])
def get_cards():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM cards")
    rows = cur.fetchall()
    result = [{"id": row[0], "name": row[1], "rarity": row[2], "quantity": row[3], "price": row[4]} for row in rows]
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
