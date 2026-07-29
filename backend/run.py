from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import sqlite3 
import os 

from app.routes.products import products_bp
from app.routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sua_senha@localhost:5432/'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'chave-secreta-unidesapego2630')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(auth_bp, url_prefix='/api/auth')


db = SQLAlchemy(auth_bp)

# ### Login ###
login_manager = LoginManager()
login_manager.init_app(auth_bp)
login_manager.login_view = 'login'










@app.route('/api/dados', methods=['GET'])

def obter_dados():
    return jsonify({"dados": "Conectado ao Flask com sucesso!"})

@app.route('/api/produtos'), 


if __name__ == '__main__':
    app.run(debug=True, port=5000)
    

