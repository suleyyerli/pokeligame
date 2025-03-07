from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config.config import Config

mysql = MySQL()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialisation des extensions
    CORS(
        app,
        origins=Config.CORS_ORIGINS,
        allow_headers=Config.CORS_HEADERS,
        methods=Config.CORS_METHODS,
    )
    mysql.init_app(app)
    jwt.init_app(app)

    # Enregistrement des blueprints
    from .routes.auth import auth_bp
    from .routes.items import items_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(items_bp, url_prefix="/api")

    return app
