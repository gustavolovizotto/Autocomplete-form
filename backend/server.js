const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
// O Render fornecerá a porta através de uma variável de ambiente
const port = process.env.PORT || 4000;

// A URL do seu frontend quando estiver no ar. Usaremos uma variável de ambiente
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Configuração do CORS mais robusta para produção
app.use(cors({
  origin: [
    frontendURL, 
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://receituario-frontend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Middlewares
app.use(express.json()); // Permite que o express entenda JSON no corpo da requisição
app.set('view engine', 'ejs'); // Define EJS como o motor de visualização
app.set('views', path.join(__dirname, 'views')); // Aponta para a pasta 'views'
app.use(express.static('public'));

// Middleware adicional para CORS (garantia extra)
app.use((req, res, next) => {
  const allowedOrigins = [
    frontendURL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://receituario-frontend.onrender.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando!', 
    timestamp: new Date().toISOString(),
    cors: {
      frontendURL,
      allowedOrigins: [
        frontendURL,
        'http://localhost:5173',
        'http://localhost:3000',
        'https://receituario-frontend.onrender.com'
      ]
    }
  });
});

// Rota principal para gerar o PDF
app.post('/gerar-pdf', async (req, res) => {
  const formData = req.body; // Pega os dados do formulário enviados pelo React

  try {
    // Converte a imagem para Base64
    const logoPath = path.join(__dirname, 'public', 'images', 'logo.png');
    let logoBase64 = '';
    
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }

    // Adiciona a imagem em Base64 aos dados
    const templateData = {
      ...formData,
      logoBase64: logoBase64
    };

    // Renderiza o template EJS com os dados do formulário
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, 'views', 'receita-template.ejs'),
      { data: templateData }
    );

    // Inicia o Puppeteer com argumentos essenciais para ambientes de deploy
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
    });
    const page = await browser.newPage();

    // Define o conteúdo da página como o HTML renderizado
    // `waitUntil: 'networkidle0'` espera todas as conexões de rede (como o CSS do Tailwind) terminarem
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Gera o PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    await browser.close();

    // Envia o PDF de volta como resposta
    res.contentType('application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
    res.status(500).send('Ocorreu um erro ao gerar o PDF.');
  }
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
  console.log(`Frontend configurado para: ${frontendURL}`);
});

// Exporta o app para o Vercel
module.exports = app;