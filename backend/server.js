const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 4000;

// Middlewares
app.use(cors()); // Permite requisições de outras origens (do nosso frontend)
app.use(express.json()); // Permite que o express entenda JSON no corpo da requisição
app.set('view engine', 'ejs'); // Define EJS como o motor de visualização
app.set('views', path.join(__dirname, 'views')); // Aponta para a pasta 'views'
app.use(express.static('public'));

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

    // Inicia o Puppeteer
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
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
});