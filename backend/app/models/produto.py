from app.database import db

# ==================================================
class Produto(db.Model):

    __tablename__ = "produtos"

    id = db.Column(db.Integer, primary_key=True)

    titulo = db.Column(db.String(150), nullable=False)

    descricao = db.Column(db.Text)

    preco = db.Column(db.Float)

    categoria = db.Column(db.String(80))

    condicao = db.Column(db.String(80))

    localizacao = db.Column(db.String(80))

    imagem = db.Column(db.Text)

    is_doacao = db.Column(db.Boolean, default=False)

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id")
    )