from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/dados', methods=['GET'])

def obter_dados():
    return jsonify({"mensagem": "Conectado ao Flask com sucesso!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    

