from flask import Blueprint, request, jsonify
from app.database import db
from app.models.usuarios import Usuario

auth_bp = Blueprint("auth", __name__)

# ==================================================
# REGISTER USER
@auth_bp.route("/register", methods=["POST"], strict_slashes=False)
def register():
    dados = request.get_json()

    if not dados:
        return jsonify({
            "erro": "Nenhum dado enviado."
        }), 400

    usuario_existente = Usuario.query.filter_by(
        email=dados["email"]
    ).first()

    if usuario_existente:
        return jsonify({
            "erro": "Este e-mail já está cadastrado."
        }), 400

    usuario = Usuario(
        nome=dados["name"],
        email=dados["email"],
        curso=dados.get("course"),
        semestre=dados.get("semester"),
        telefone=dados.get("whatsapp")
    )

    senha_usuario = dados.get("senha") or dados.get("password") or ""
    usuario.set_password(senha_usuario)

    db.session.add(usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Usuário cadastrado com sucesso!",
        "usuario": {
            "id": usuario.id,
            "name": usuario.nome,
            "email": usuario.email,
            "course": usuario.curso,
            "semester": usuario.semestre,
            "whatsapp": usuario.telefone
        }
    }), 201


# ==================================================
# LOGIN
@auth_bp.route("/login", methods=["POST"], strict_slashes=False)
def login():
    dados = request.get_json()

    #Searches for the user by email
    usuario = Usuario.query.filter_by(
        email=dados.get("email")
    ).first()

    if usuario is None:
        return jsonify({
            "erro": "Usuário não encontrado."
        }), 404

    # Take the password sent by the frontend (whether it's "password" or "senha")
    senha_recebida = dados.get("password") or dados.get("senha")

    #Checks if the password matches the one in the database.
    if not usuario.check_password(senha_recebida):
        return jsonify({
            "erro": "Senha incorreta."
        }), 401

    return jsonify({
        "usuario": {
            "id": usuario.id,
            "name": usuario.nome,
            "email": usuario.email,
            "course": usuario.curso,
            "semester": usuario.semestre,
            "whatsapp": usuario.telefone,
            "verifiedStudent": True
        }
    }), 200

# ==================================================
# PROFILE
@auth_bp.route("/profile/<int:id>", methods=["GET"], strict_slashes=False)
def perfil(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({
            "erro": "Usuário não encontrado."
        }), 404

    return jsonify({
        "id": usuario.id,
        "name": usuario.nome,
        "email": usuario.email,
        "course": usuario.curso,
        "semester": usuario.semestre,
        "whatsapp": usuario.telefone,
        "verifiedStudent": True
    })

# ==================================================
# EDIT PROFILE
@auth_bp.route("/profile/<int:id>", methods=["PUT"], strict_slashes=False)
def editar_perfil(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({
            "erro": "Usuário não encontrado."
        }), 404

    dados = request.get_json()

    usuario.nome = dados.get("name", usuario.nome)
    usuario.email = dados.get("email", usuario.email)
    usuario.curso = dados.get("course", usuario.curso)
    usuario.semestre = dados.get("semester", usuario.semestre)
    usuario.telefone = dados.get("whatsapp", usuario.telefone)

    if dados.get("senha"):
        senha_usuario = dados.get("senha") or dados.get("password") or ""
        usuario.set_password(senha_usuario)

    db.session.commit()

    return jsonify({
        "mensagem": "Perfil atualizado com sucesso."
    })

# ==================================================
# DELETE USER
@auth_bp.route("/profile/<int:id>", methods=["DELETE"], strict_slashes=False)
def excluir_usuario(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({
            "erro": "Usuário não encontrado."
        }), 404

    db.session.delete(usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Usuário removido com sucesso."
    })