# Formulário de Receituário Médico

Sistema para geração de receituários médicos com controle especial, desenvolvido com React (frontend) e Node.js/Express (backend).

## Funcionalidades

- ✅ Formulário para preenchimento de dados médicos e do paciente
- ✅ Geração automática de PDF do receituário
- ✅ Template EJS responsivo para impressão
- ✅ Upload e exibição de logo médico
- ✅ Campos para identificação do comprador e fornecedor

## Estrutura do Projeto

```
├── backend/              # Servidor Node.js/Express
│   ├── views/           # Templates EJS
│   ├── public/          # Arquivos estáticos
│   └── server.js        # Servidor principal
└── Editable-Document/   # Frontend React/Vite
    ├── src/            # Código fonte React
    └── public/         # Arquivos públicos
```

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- EJS (template engine)
- Puppeteer (geração de PDF)
- CORS

### Frontend
- React
- Vite
- Tailwind CSS

## Como Executar

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd Editable-Document
npm install
npm run dev
```

## Deploy

Este projeto está configurado para deploy no Netlify com as seguintes configurações:

- **Frontend**: Deploy automático via GitHub
- **Backend**: Deploy em serviço compatível com Node.js (Railway, Render, etc.)

## Autor

Gustavo - Desenvolvedor Full Stack
