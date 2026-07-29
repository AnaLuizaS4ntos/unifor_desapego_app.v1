from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.products import products_bp
from app.routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

# Configurações do Banco do Dados (No Render você usará uma variável de ambiente)
import os
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:senha@localhost:5432/unidesapego')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/api/dados', methods=['GET'])
def obter_dados():
    return jsonify({"dados": "Conectado ao Flask com sucesso!"})

# IMPORTANTE: Deixe o app.run() apenas para o seu computador local
if __name__ == '__main__':
    app.run(debug=True, port=5000)
