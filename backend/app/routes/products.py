from flask import Blueprint, jsonify, request
from app.database import db
from app.models.produto import Produto

products_bp = Blueprint("products", __name__)


@products_bp.route("/", methods=["GET"])
def listar_produtos():
    produtos = Produto.query.all()
    lista = []

    for produto in produtos:
        lista.append({
            "id": str(produto.id), # <-- CORREÇÃO AQUI
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


@products_bp.route("/", methods=["POST"])
def cadastrar_produto():
    dados = request.get_json()

    # Prevenção extra caso venha sem imagens
    imagem_url = None
    if dados.get("images") and isinstance(dados["images"], list) and len(dados["images"]) > 0:
        imagem_url = dados["images"][0]

    # Usando .get() para evitar KeyErrors e definindo valores padrão onde faz sentido
    novo = Produto(
        titulo=dados.get("title", "Sem Título"),
        descricao=dados.get("description", ""),
        preco=float(dados.get("price", 0.0)), # Garante que seja float
        categoria=dados.get("category", "Outros"),
        condicao=dados.get("condition", "Usado"),
        localizacao=dados.get("location", "Não informado"),
        imagem=imagem_url,
        is_doacao=dados.get("isDonation", False),
        usuario_id=dados.get("usuario_id") # Cuidado aqui se não estiver logado!
    )

    db.session.add(novo)
    db.session.commit()

    return jsonify({
        "mensagem": "Produto cadastrado com sucesso.",
        "id": str(novo.id) # Retornando como string também
    }), 201