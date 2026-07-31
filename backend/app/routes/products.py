from flask import Blueprint, jsonify, request
from app.database import db
from app.models.produto import Produto

products_bp = Blueprint("products", __name__)


#strict_slashes=False
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

# strict_slashes=False no POST!
@products_bp.route("", methods=["POST"], strict_slashes=False)
def cadastrar_produto():
    dados = request.get_json()

    imagem_url = None
    if dados.get("images") and isinstance(dados["images"], list) and len(dados["images"]) > 0:
        imagem_url = dados["images"][0]

    # Tenta limpar e converter o ID enviado pelo frontend
    raw_user_id = dados.get("usuario_id")
    usuario_id_int = None
    
    if raw_user_id:
        try:
            usuario_id_int = int(str(raw_user_id).replace("user-", "").strip())
        except ValueError:
            pass

    # Importa o modelo de usuário para validação no banco
    from app.models.usuarios import Usuario

    # Garante que o usuario_id realmente existe no PostgreSQL para não dar erro de chave estrangeira
    usuario_valido = Usuario.query.get(usuario_id_int) if usuario_id_int else None
    
    if not usuario_valido:
        # Se não achou, pega o primeiro usuário cadastrado no banco
        primeiro_usuario = Usuario.query.first()
        if primeiro_usuario:
            usuario_id_int = primeiro_usuario.id
        else:
            # Se a tabela estiver vazia, cria um usuário padrão de segurança na hora
            user_padrao = Usuario(
                nome="Ana Luiza", 
                email="analuizadossantos5@gmail.com", 
                curso="Ciência da Computação",
                semestre="6º Semestre",
                telefone="85999887766"
            )
            db.session.add(user_padrao)
            db.session.commit()
            usuario_id_int = user_padrao.id

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