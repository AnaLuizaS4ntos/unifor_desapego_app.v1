from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sua_senha@localhost:5432/'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.route('/api/dados', methods=['GET'])

def obter_dados():
    return jsonify({"dados": "Conectado ao Flask com sucesso!"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
    

