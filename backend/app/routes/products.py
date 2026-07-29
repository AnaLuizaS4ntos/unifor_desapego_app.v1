from flask import Blueprint, jsonify

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    items = [
        {
            "id": "item-1",
            "title": "Kit Arduino Uno R3 + Sensores",
            "description": "Usado por 1 semestre na disciplina de Hardware. Funciona perfeitamente.",
            "price": 120,
            "isDonation": False,
            "category": "Eletrônicos & Hardware",
            "condition": "Usado - Bom Estado",
            "location": "Bloco N (CCT)",
            "images": ["https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80"],
            "seller": { 
                "name": "Ana Luiza", 
                "course": "Ciência da Computação", 
                "semester": "Ativo", 
                "whatsapp": "5585999999999", 
                "verifiedStudent": True 
            },
            "createdAt": "Hoje", 
            "views": 12, 
            "favoritesCount": 2, 
            "tags": ["arduino", "cct"]
        },
        {
            "id": "item-2",
            "title": "Cálculo I - Stewart (Volume 1)",
            "description": "Livro do Stewart, algumas marcações a lápis mas super conservado.",
            "price": 0,
            "isDonation": True,
            "category": "Livros & Apostilas",
            "condition": "Seminovo",
            "location": "Biblioteca Central",
            "images": ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"],
            "seller": { 
                "name": "Lucas", 
                "course": "Engenharia", 
                "semester": "Ativo", 
                "whatsapp": "5585999999999", 
                "verifiedStudent": True 
            },
            "createdAt": "Ontem", 
            "views": 45, 
            "favoritesCount": 5, 
            "tags": ["calculo", "livro"]
        }
    ]
    
    return jsonify(items)