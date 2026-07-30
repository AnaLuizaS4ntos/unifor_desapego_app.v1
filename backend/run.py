from flask import Flask
from flask_cors import CORS
import os

from app.database import db

from app.routes.products import products_bp
from app.routes.auth import auth_bp

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:eudeybanana@localhost:5432/unidesapego"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(products_bp, url_prefix="/api/products")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# IMPORTANTE: Importe seus models aqui para o SQLAlchemy "enxergar" as tabelas!
# Ajuste os nomes conforme os arquivos reais que você tem dentro de app/models
from app.models import usuarios, produto

with app.app_context():
    db.create_all()
    print("Tabelas verificadas/criadas com sucesso no PostgreSQL!")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    