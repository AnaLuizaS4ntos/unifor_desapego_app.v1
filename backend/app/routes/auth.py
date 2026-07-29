from flask import Blueprint, jsonify, request

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    
    dados = request.get_json()
    name = dados.get('name')
    email = dados.get('email')
    senha = dados.get('senha')
    

    if email == "usuario@unifor.br" and senha == "123456":
        return jsonify({
        "mensagem": "Usuário cadastrado com sucesso no UniDesapego!",
        "usuario": {
            "name": name,
            "email": email
        }
    }), 201
    return jsonify({"erro": "E-mail ou senha incorretos"}), 401
