import datetime


class Config:
    # Configuration JWT
    JWT_SECRET_KEY = "votre-cle-secrete-super-securisee"
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=1)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # Configuration MySQL
    MYSQL_HOST = "localhost"
    MYSQL_USER = "root"
    MYSQL_PASSWORD = "sololeveling"
    MYSQL_DB = "pokeligame"

    # Configuration CORS
    CORS_ORIGINS = ["*"]
    CORS_HEADERS = ["Content-Type", "Authorization"]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
