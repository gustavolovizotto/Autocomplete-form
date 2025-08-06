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
    console.log('📝 Recebendo dados do formulário:', formData);

    // Converte a imagem para Base64
    const logoPath = path.join(__dirname, 'public', 'images', 'logo.png');
    let logoBase64 = '';
    
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      console.log('🖼️ Logo carregada com sucesso');
    } else {
      console.log('⚠️ Logo não encontrada no caminho:', logoPath);
    }

    // Adiciona a imagem em Base64 aos dados
    const templateData = {
      ...formData,
      logoBase64: logoBase64
    };

    console.log('🎨 Renderizando template EJS...');
    // Renderiza o template EJS com os dados do formulário
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, 'views', 'receita-template.ejs'),
      { data: templateData }
    );
    console.log('✅ Template renderizado com sucesso');

    console.log('🚀 Iniciando Puppeteer...');
    // Inicia o Puppeteer com argumentos essenciais para ambientes de deploy
    const puppeteerOptions = { 
      headless: true, 
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--single-process'
      ]
    };

    // Se estiver no Render, especifica o caminho do executável do Chrome
    if (process.env.RENDER || process.env.NODE_ENV === 'production') {
      console.log('🔧 Configurando para ambiente Render...');
      // Puppeteer vai procurar o Chrome no cache configurado
      puppeteerOptions.executablePath = puppeteer.executablePath();
    }

    const browser = await puppeteer.launch(puppeteerOptions);
    console.log('✅ Puppeteer iniciado');

    const page = await browser.newPage();
    console.log('📄 Nova página criada');

    // Define o conteúdo da página como o HTML renderizado
    // `waitUntil: 'networkidle0'` espera todas as conexões de rede (como o CSS do Tailwind) terminarem
    console.log('🔄 Definindo conteúdo da página...');
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded', // Mudança: usa domcontentloaded ao invés de networkidle0
      timeout: 30000 
    });
    console.log('✅ Conteúdo definido na página');

    console.log('📄 Gerando PDF...');
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
    console.log('✅ PDF gerado com sucesso, tamanho:', pdfBuffer.length);

    await browser.close();
    console.log('🔒 Browser fechado');

    // Envia o PDF de volta como resposta
    res.contentType('application/pdf');
    res.send(pdfBuffer);
    console.log('📤 PDF enviado com sucesso');

  } catch (error) {
    console.error('❌ Erro detalhado ao gerar o PDF:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Erro ao gerar o PDF', 
      details: error.message,
      stack: error.stack 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
  console.log(`Frontend configurado para: ${frontendURL}`);
});

// Exporta o app para o Vercel
module.exports = app;