# UniDesapego 🎓
**Plataforma de Economia Circular para a comunidade do Campus UNIFOR.**
Projeto desenvolvido para o Desafio Técnico do Processo Seletivo - Laboratório Vortex.

**Autor:** Ana Luiza Dos Santos Souza (2520530 - Ciência da Computação)

## 🎯 Sobre o Projeto
O UniDesapego é um marketplace universitário focado na economia circular. O objetivo é permitir que estudantes cadastrem itens para doação ou venda (livros de cálculo, kits Arduino, jalecos, etc.), facilitando o acesso a materiais para calouros e veteranos.

## 🛠️ Tecnologias Utilizadas
*   **Frontend:** React, Vite, Tailwind CSS v4, Lucide React, Figma.
*   **Backend:** Python, Flask, Flask-CORS.
*   **Banco de Dados:** SQLite (leve e funcional para o MVP).
*   **PWA:** vite-plugin-pwa.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
*   Node.js instalado.
*   Python 3.x instalado.

### Rodando o Frontend
1. Entre na pasta do frontend: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run dev`
4. Acesse no navegador: `http://localhost:5173`

### Rodando o Backend
1. Entre na pasta do backend: `cd backend`
2. Ative a máquina virtual: `.\.venv\Scripts\activate` (Windows)
3. Instale as dependências: `pip install -r requirements.txt`
4. Rode a API: `python run.py`

---

## 🤖 Diário de Bordo da IA (GenAI)

Conforme solicitado no edital, utilizei Inteligência Artificial Generativa como ferramenta de produtividade e pair programming durante o desenvolvimento.

### 1. Ferramentas Utilizadas
*   Google Gemini (Para arquitetura do projeto, debug de erros do React e estruturação do PWA).

### 2. Estratégia de Engenharia de Prompts
Exemplos de prompts utilizados para destravar o desenvolvimento:
> *"Crie a estrutura de componentes React para um marketplace universitário chamado UniDesapego, incluindo categorias de produtos como 'Eletrônicos & Hardware' e 'Livros & Apostilas'. Quero o design usando Tailwind CSS."*

> *"Meu Vite está dando o erro '[postcss] ENOENT: no such file or directory... tailwindcss' quando tento rodar o projeto. O arquivo index.css está importando o Tailwind. Como configuro o vite.config.js corretamente para resolver isso?"*

### 3. Reflexão Crítica sobre o uso da IA
Durante a estilização do frontend, a IA gerou um arquivo `index.css` com a sintaxe `@import "tailwindcss";`, que é exclusiva do recém-lançado **Tailwind v4**. Porém, os comandos iniciais de instalação sugeridos pela IA configuraram a **versão 3** da biblioteca no meu projeto. 

Isso gerou uma falha de compilação silenciosa onde o Vite não conseguia interpretar as classes utilitárias, quebrando todo o design (a tela ficou renderizando apenas HTML puro). 

Para corrigir essa "alucinação" (mistura de versões de pacotes pela IA), precisei debugar o erro no terminal, desinstalar os arquivos antigos de configuração (`tailwind.config.js`) e atualizar o ecossistema especificamente para o pacote `@tailwindcss/vite`, ajustando o `vite.config.js`. Isso prova que gerar código com IA exige supervisão constante sobre as dependências e versões do ecossistema JavaScript.