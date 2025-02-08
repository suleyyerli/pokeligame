from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

app = Flask(__name__)
CORS(app)

# Clé secrète pour JWT
app.config['JWT_SECRET_KEY'] = 'votre-cle-secrete-super-securisee'  
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# Configuration MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Ton utilisateur MySQL
app.config['MYSQL_PASSWORD'] = 'sololeveling'  # Ton mot de passe MySQL
app.config['MYSQL_DB'] = 'pokeligame'

mysql = MySQL(app)
jwt = JWTManager(app)

# Route d'accueil
@app.route('/')
def home():
    return "Bienvenue sur le backend Pokeligame !"

# Route pour l'inscription
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Vérification des données requises
    if not all(k in data for k in ['email', 'password', 'username']):
        return jsonify({'error': 'Données manquantes'}), 400
    
    # Vérification si l'email existe déjà
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", [data['email']])
    if cur.fetchone() is not None:
        return jsonify({'error': 'Email déjà utilisé'}), 409
    
    # Hashage du mot de passe
    hashed_password = generate_password_hash(data['password'])
    
    # Insertion du nouvel utilisateur
    cur.execute(
        "INSERT INTO users (email, password, username) VALUES (%s, %s, %s)",
        [data['email'], hashed_password, data['username']]
    )
    mysql.connection.commit()
    
    return jsonify({'message': 'Inscription réussie'}), 201

# Route pour la connexion
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Vérification des données requises
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Email et mot de passe requis'}), 400
    
    # Recherche de l'utilisateur
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", [data['email']])
    user = cur.fetchone()
    
    # Vérification du mot de passe
    if user and check_password_hash(user[2], data['password']):  # user[2] est le mot de passe hashé
        # Création du token avec l'ID converti en string
        access_token = create_access_token(identity=str(user[0]))  # Conversion en string
        return jsonify({
            'token': access_token,
            'user_id': user[0],
            'username': user[3]
        }), 200
    
    return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

# Modification de la route get_cards
@app.route('/cards', methods=['GET'])
@jwt_required()
def get_cards():
    current_user_id = int(get_jwt_identity())  # Conversion en int
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM cards WHERE user_id = %s", [current_user_id])
    rows = cur.fetchall()
    result = [{"id": row[0], "name": row[1], "rarity": row[2], "quantity": row[3], "price": row[4]} for row in rows]
    return jsonify(result)

# Route pour la déconnexion
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Déconnexion réussie'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
