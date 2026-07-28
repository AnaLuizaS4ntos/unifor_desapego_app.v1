**AQUI DEDICO TODAS as ANOTAÇÕES E IDEIAS DO PROCESSO DO SITE PENSADO POR MIM**

**passos do desafio com configuração de pastas conforme a linguagem que vou usar para o projeto**

**[LINGUAGENS QUE ESCOLHI: Python, Flask, React]**

-- criar um marketplace de desapego --

[]config pasta .venv
[] instalar o microframework (pip install flask flask-cors) e depois (python.exe -m pip install --upgrade pip)
[]config permissão do venv no windowns


## como criar pastas pelo terminal
-mkdir nomedapasta
-cd nomedapasta
-echo > nomedoarquivo.py/html/js, etc

------usando Vite para organizar as pastas do jeito que montei nesse arquivo------
usei os comandos:
cd ..
cd frontend
npm create vite@latest . -- --template react
npm install

-------
intalando o axios para o HTTP se conecte com o servidor de APIs externas no react

cd frontend 
npm install axios
npm run dev

----------


**1. backend**
        -criar pastas
        -config flask
        -config JSON

    **minha estrutura de pastas para o backend**
        backend/
app/
    __init__.py        #Inicializa a app Flask e carrega extensões
        routes/            
            auth.py        
            products.py    
            categories.py  
        models/            # Modelos do banco (ex: SQLAlchemy)
            user.py
            product.py
        services/         
    tests/
    config.py              #Configurações de dev, prod e banco de dados
    extensions.py          #Instâncias de db, cors, jwt, etc.
    requirements.txt       
    run.py                 

--
comando pra ativar o .venv dentro do backend:

cd backend
.\.venv\Scripts\Activate.ps1


---
criar as rotas para o marketplace

-auth
    autenticação de login e cadastro(post)


-products
    anuncio dos produtos disponiveis 
    -lista com todos os produtos cadastrados (get)
    -descrição dos produtos id(get)
    -criar novo anuncio de produto(post)
    -editar o anuncio que vai postar(put)
    -CRUD do produto anunciado(delete)

-categories
    categoria do produto que vai ser anunciado no unifor desapega(get)


**2. frontend**
        -criar pastas
        -config react

    **minha estrutura de pastas para o frontend**
        -public/
            -favicon, html e estáticos

        -src/
            -img
            -components
            -layouts           
            -pages             
            -routes                  
            -services  #aqui é a chamada da API
            -styles 


----

-usar o App.jsx para o front end e conectar a API



**3. fazer design do site web e mobile**
        -usar figma e react

**4. versão mobile**
**5. fazer deploy**





