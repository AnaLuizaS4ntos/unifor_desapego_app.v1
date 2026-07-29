UniDesapego 🎓

Plataforma de Economia Circular para a comunidade do Campus UNIFOR.
Projeto desenvolvido para o Desafio Técnico do Processo Seletivo - Laboratório Vortex.

Autor: Ana Luiza Dos Santos Souza (Ciência da Computação)

**Sobre o Projeto**

O UniDesapego é um marketplace universitário focado na economia circular. O objetivo é permitir que estudantes cadastrem itens para doação ou venda (livros de cálculo, kits Arduino, jalecos, etc.), facilitando o acesso a materiais para calouros e veteranos e promovendo a sustentabilidade no campus.

**Tecnologias Utilizadas**

Frontend: React, Vite, Tailwind CSS v4, Lucide React.
Design & UI: Figma (Criação de iconografia autoral e prototipação).
Backend: Python, Flask, Flask-CORS.
Banco de Dados: SQLite (leve e funcional para persistência local do MVP).
PWA: Implementação nativa via manifest.json e sw.js para instalação como aplicativo mobile.

**Como Executar o Projeto Localmente**

Pré-requisitos
Node.js instalado.
Python 3.x instalado.
Rodando o Frontend
Entre na pasta do frontend: cd frontend
Instale as dependências: npm install
Inicie o servidor: npm run dev
Acesse no navegador: http://localhost:5173
Rodando o Backend
Entre na pasta do backend: cd backend
Ative a máquina virtual: .\.venv\Scripts\activate (Windows) ou source venv/bin/activate (Mac/Linux)
Instale as dependências: pip install -r requirements.txt
Rode a API: python run.py

**Diário de Bordo da IA (GenAI)**

Conforme solicitado no edital, utilizei Inteligência Artificial Generativa como ferramenta de produtividade e pair programming durante o desenvolvimento, mantendo o senso crítico sobre o código gerado.

1. Ferramentas Utilizadas

-Google Gemini: Utilizado para planejamento da arquitetura do projeto, debug de erros complexos de compilação e estruturação do PWA.

-Google AI Studio: Utilizado para a ideação inicial e geração da base estrutural da interface (HTML/Tailwind) a partir de uma paleta de cores pré-definida.

-GitHub Copilot: Integrado ao VS Code, atuou como assistente de micro-tarefas, autocompletando blocos repetitivos de JSX e auxiliando na rápida correção de erros de linting (ESLint).

2. Estratégia de Engenharia de Prompts

Exemplos de prompts reais utilizados para destravar o desenvolvimento e guiar a IA:

"Crie a estrutura de componentes React para um marketplace universitário chamado UniDesapego, incluindo categorias de produtos como 'Eletrônicos & Hardware' e 'Livros & Apostilas'. Quero o design usando Tailwind CSS."

(No Google AI Studio): "Gere a interface base para uma plataforma de desapego universitário. Utilize estritamente esta paleta de cores institucionais [HEX codes] e estruture os cards de produtos com foco em conversão."

"Meu Vite está dando o erro '[postcss] ENOENT: no such file or directory... tailwindcss'. O arquivo index.css está importando o Tailwind. Como configuro o vite.config.js corretamente para resolver isso sem quebrar a tela de PWA?"

3. Reflexão Crítica sobre o uso da IA

A IA provou ser um acelerador incrível, mas exige curadoria técnica e adaptação constante. Um grande exemplo disso foi a construção da interface: utilizei o Google AI Studio para gerar a base visual fornecendo a paleta de cores. No entanto, a IA gerou o código estruturado inteiramente em TypeScript e com uma arquitetura genérica. Em vez de simplesmente "copiar e colar", precisei refatorar e traduzir o código inteiro para JavaScript puro (JSX), separando o CSS e os elementos visuais nos componentes corretos da minha arquitetura React.

Além disso, para garantir a identidade visual e aplicar a expertise em design gráfico no projeto, não dependi 100% da IA na interface: desenhei os ícones principais e assets visuais manualmente no Figma, unindo a velocidade da inteligência artificial com o refinamento humano.

Por fim, durante a estilização, o Gemini sugeriu uma configuração do Tailwind v4 mesclada com a versão 3, o que gerou uma falha de compilação silenciosa onde o Vite não conseguia interpretar as classes utilitárias. Para corrigir essa "alucinação" (mistura de versões de pacotes), precisei debugar o erro no terminal, entender o conflito de ecossistema e atualizar as dependências manualmente, provando que gerar código exige leitura atenta de cada linha e supervisão técnica sobre a estrutura.

**Status e Roadmap**

[x] UI/UX e paleta institucional construídas com Tailwind.

[x] Catálogo dinâmico com filtros e modais (React).

[x] Configuração de PWA (manifest e Service Worker nativos).

[x] Autenticação simulada/Interface de Login e Cadastro (Diferencial).

[ ] Construção do banco de dados relacional (SQLite).

[ ] Conexão das rotas CRUD (RESTful API em Flask).

[ ] Deploy do Backend (Render) e Frontend (Vercel) para ambiente de produção.