const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'backend', 'views'));

// Rota para gerar PDF
app.post('/api/gerar-pdf', async (req, res) => {
  const formData = req.body;

  try {
    // Converte a imagem para Base64
    const logoPath = path.join(__dirname, '..', 'backend', 'public', 'images', 'logo.png');
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

    // Renderiza o template EJS
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, '..', 'backend', 'views', 'receita-template.ejs'),
      { data: templateData }
    );

    // Inicia o Puppeteer
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();

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

    res.contentType('application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
    res.status(500).send('Ocorreu um erro ao gerar o PDF.');
  }
});

// Exporta para Vercel
module.exports = app;
