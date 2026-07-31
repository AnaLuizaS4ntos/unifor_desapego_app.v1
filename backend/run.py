from flask import Flask
from flask_cors import CORS
import os
from app.database import db
from app.routes.products import products_bp
from app.routes.auth import auth_bp

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 #Increases the request body size limit to 16MB.
app.url_map.strict_slashes = False # DISABLES READING OF THE FINAL BAR

CORS(app)

minha_url_db = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:eudeybanana@localhost:5432/unidesapego"
)

### Fixes the Render bug where it sends 'postgres://' instead of 'postgresql://'(for not bugs)
if minha_url_db.startswith("postgres://"):
    minha_url_db = minha_url_db.replace("postgres://", "postgresql://", 1)

### Saves to the Flask configuration
app.config["SQLALCHEMY_DATABASE_URI"] = minha_url_db

db.init_app(app)
app.register_blueprint(products_bp, url_prefix="/api/products")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

from app.models import usuarios, produto

with app.app_context():
    db.create_all()
    print("Tabelas verificadas/criadas com sucesso no PostgreSQL!")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    