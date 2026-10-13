from app.database import db
from werkzeug.security import generate_password_hash, check_password_hash


# ==================================================
class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(120), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    senha = db.Column(db.String(255), nullable=False)

    curso = db.Column(db.String(120))

    semestre = db.Column(db.String(30))

    telefone = db.Column(db.String(30))

    foto = db.Column(db.String(255))

    produtos = db.relationship(
        "Produto",
        backref="usuario",
        lazy=True
    )

    def set_password(self, senha):
        self.senha = generate_password_hash(senha)

    def check_password(self, senha):
        return check_password_hash(self.senha, senha)