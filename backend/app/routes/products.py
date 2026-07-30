from flask import Blueprint, jsonify, request
from app.database import db
from app.models.produto import Produto

products_bp = Blueprint("products", __name__)


# AQUI ESTÁ A MÁGICA: strict_slashes=False direto na rota!
@products_bp.route("", methods=["GET"], strict_slashes=False)
def listar_produtos():
    produtos = Produto.query.all()
    lista = []

    for produto in produtos:
        lista.append({
            "id": str(produto.id),
            "title": produto.titulo,
            "description": produto.descricao,
            "price": produto.preco,
            "isDonation": produto.is_doacao,
            "category": produto.categoria,
            "condition": produto.condicao,
            "location": produto.localizacao,
            "images": [produto.imagem] if produto.imagem else [],
            "seller": {
                "name": produto.usuario.nome if produto.usuario else "Usuário Desconhecido",
                "course": produto.usuario.curso if produto.usuario else "",
                "semester": produto.usuario.semestre if produto.usuario else "",
                "whatsapp": produto.usuario.telefone if produto.usuario else "",
                "verifiedStudent": True
            },
            "createdAt": "Agora",
            "views": 0,
            "favoritesCount": 0,
            "tags": []
        })

    return jsonify(lista)

# AQUI TAMBÉM: strict_slashes=False no POST!
@products_bp.route("", methods=["POST"], strict_slashes=False)
def cadastrar_produto():
    dados = request.get_json()

    imagem_url = None
    if dados.get("images") and isinstance(dados["images"], list) and len(dados["images"]) > 0:
        imagem_url = dados["images"][0]

    # Tratamento seguro para converter o ID do usuário em número inteiro
    raw_user_id = dados.get("usuario_id")
    usuario_id_int = 1 # Valor padrão caso venha vazio
    
    if raw_user_id is not None:
        try:
            # Se vier no formato "user-123", remove o prefixo e converte para int
            clean_id = str(raw_user_id).replace("user-", "")
            usuario_id_int = int(clean_id)
        except ValueError:
            usuario_id_int = 1

    novo = Produto(
        titulo=dados.get("title", "Sem Título"),
        descricao=dados.get("description", ""),
        preco=float(dados.get("price", 0.0)),
        categoria=dados.get("category", "Outros"),
        condicao=dados.get("condition", "Usado"),
        localizacao=dados.get("location", "Não informado"),
        imagem=imagem_url,
        is_doacao=dados.get("isDonation", False),
        usuario_id=usuario_id_int
    )

    db.session.add(novo)
    db.session.commit()

    return jsonify({
        "mensagem": "Produto cadastrado com sucesso.",
        "id": str(novo.id)
    }), 201