from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

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

@app.route('/api/dados', methods=['GET'])

def obter_dados():
    return jsonify({"dados": "Conectado ao Flask com sucesso!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    

