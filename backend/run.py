from flask import Flask
from flask_cors import CORS
import os

from app.database import db

from app.routes.products import products_bp
from app.routes.auth import auth_bp

app = Flask(__name__)

# DESATIVA A CHATICE DA BARRA FINAL
app.url_map.strict_slashes = False 

CORS(app)

# 1. Pega a URL (do Render ou do seu PC)
minha_url_db = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:eudeybanana@localhost:5432/unidesapego"
)

# 2. Arruma o bug do Render caso ele mande 'postgres://' no lugar de 'postgresql://'
if minha_url_db.startswith("postgres://"):
    minha_url_db = minha_url_db.replace("postgres://", "postgresql://", 1)

# 3. Salva na configuração do Flask
app.config["SQLALCHEMY_DATABASE_URI"] = minha_url_db

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
    