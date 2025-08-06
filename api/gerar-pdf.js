const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const ejs = require('ejs');

// Configuração para diferentes ambientes
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Serverless function para Vercel
module.exports = async (req, res) => {
  console.log('🔥 API chamada! Método:', req.method);
  console.log('📦 Body recebido:', req.body);
  
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Respondendo a preflight request');
    return res.status(200).end();
  }

  // Só aceita POST
  if (req.method !== 'POST') {
    console.log('❌ Método não permitido:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;
  console.log('📝 Dados do formulário processados:', formData);

  try {
    console.log('🎨 Iniciando geração do template...');
    
    // Para o Vercel, vamos incluir a imagem como base64 hardcoded
    // ou buscar de uma URL pública
    let logoBase64 = '';
    
    // Adiciona a imagem em Base64 aos dados
    const templateData = {
      ...formData,
      logoBase64: logoBase64
    };

    console.log('📋 Template data preparado');

    // Template EJS inline (já que o Vercel pode ter problemas com arquivos externos)
    const templateContent = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Receituário - <%= data.paciente %></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { width: 210mm; min-height: 297mm; font-family: sans-serif; -webkit-print-color-adjust: exact; }
        .linha-preenchimento { height: 1.2rem; background-color: #f3f4f6; border-bottom: 1px solid #9ca3af; flex-grow: 1; }
        .rotulo { font-weight: bold; margin-right: 4px; white-space: nowrap; }
        .campo-container { display: flex; align-items: center; margin-bottom: 2px; }
    </style>
</head>
<body class="bg-white p-4 text-black text-xs">
    <div class="text-center">
        <h2 class="text-xl font-bold">RECEITUÁRIO DE CONTROLE ESPECIAL</h2>
    </div>
    
    <div class="border-2 border-black p-2 mt-5">
    <h3 class="text-center font-bold text-lg mb-3 ">IDENTIFICAÇÃO DO EMITENTE</h3>
    
    <div class="flex mb-5 gap-4">
        <div class="w-2/3">
            <div class="grid grid-cols-5 gap-x-2 gap-y-1">
                <div class="col-span-5"><strong>NOME COMPLETO:</strong> <%= data.nomeMedico %></div>
                <div class="col-span-2"><strong>CRM:</strong> <%= data.crm %></div>
                <div class="col-span-3"><strong>UF:</strong> <%= data.crmUf %></div>
                <div class="col-span-5"><strong>ENDEREÇO COMPLETO:</strong> <%= data.enderecoMedico %></div>
                <div class="col-span-2"><strong>CIDADE:</strong> <%= data.cidadeMedico %></div>
                <div class="col-span-3"><strong>UF:</strong> <%= data.cidadeUf %></div>
                <div class="col-span-2"><strong>TELEFONE:</strong> <%= data.telefoneMedico %></div>
                <div class="col-span-3"><strong>DATA:</strong> <%= data.data %></div>
            </div>
        </div>

        <div class="w-1/3 flex flex-col border-l-2 pl-4">
            <div class="flex items-center justify-center">
                <% if (data.logoBase64) { %>
                    <img src="<%= data.logoBase64 %>" alt="Logo do Médico" class="max-w-full h-15">
                <% } else { %>
                    <div class="w-24 h-24 border-2 border-gray-300 flex items-center justify-center text-gray-500 text-xs">
                        Logo Rita de Cássia
                    </div>
                <% } %>
            </div>

            <div class="flex-grow"></div>

            <div>
                <p class="border-t-2 border-black text-center ">ASSINATURA MÉDICO(A)</p>
            </div>
        </div>
    </div>
</div>
    <div class="mt-2 text-sm">
        <p><strong>NOME PACIENTE:</strong> <%= data.paciente %></p>
        <p><strong>ENDEREÇO COMPLETO:</strong> <%= data.enderecoPaciente %></p>
        <div class="mt-2 border-2 border-black h-[50vh]">
            <p class="pl-2 pt-2"><strong>PRESCRIÇÃO:</strong></p>
            <p class="pl-2 whitespace-pre-wrap text-base"><%= data.prescricao %></p>
        </div>
    </div>

    <div class="flex gap-2 mt-6">
        <div class="w-1/2 border-2 border-black p-2 flex flex-col justify-between">
            <div>
                <h3 class="text-center font-bold text-sm mb-2">IDENTIFICAÇÃO DO COMPRADOR</h3>
                <div class="campo-container"><span class="rotulo">NOME COMPLETO:</span><span class="linha-preenchimento"></span></div>
                <div class="campo-container"><span class="rotulo">RG:</span><span class="linha-preenchimento"></span></div>
                <div class="campo-container"><span class="rotulo">ÓRGÃO EMISSOR:</span><span class="linha-preenchimento"></span></div>
                <div class="campo-container"><span class="rotulo">ENDEREÇO COMPLETO:</span><span class="linha-preenchimento"></span></div>
                <div class="flex gap-2">
                    <div class="w-2/3 campo-container"><span class="rotulo">CIDADE:</span><span class="linha-preenchimento"></span></div>
                    <div class="w-1/3 campo-container"><span class="rotulo">UF:</span><span class="linha-preenchimento"></span></div>
                </div>
                <div class="campo-container"><span class="rotulo">TELEFONE:</span><span class="linha-preenchimento"></span></div>
            </div>
        </div>
        <div class="w-1/2 border-2 border-black p-2 flex flex-col justify-between">
            <div>
                <h3 class="text-center font-bold text-sm mb-2">IDENTIFICAÇÃO DO FORNECEDOR</h3>
                <div class="campo-container"><span class="rotulo">NOME FARMACÊUTICO(A):</span><span class="linha-preenchimento"></span></div>
                <div class="flex gap-2">
                    <div class="w-2/3 campo-container"><span class="rotulo">CRF:</span><span class="linha-preenchimento"></span></div>
                    <div class="w-1/3 campo-container"><span class="rotulo">UF:</span><span class="linha-preenchimento"></span></div>
                </div>
                <div class="campo-container"><span class="rotulo">NOME FARMÁCIA:</span><span class="linha-preenchimento"></span></div>
                <div class="campo-container"><span class="rotulo">ENDEREÇO:</span><span class="linha-preenchimento"></span></div>
                <div class="flex gap-2">
                    <div class="w-2/3 campo-container"><span class="rotulo">CIDADE:</span><span class="linha-preenchimento"></span></div>
                    <div class="w-1/3 campo-container"><span class="rotulo">UF:</span><span class="linha-preenchimento"></span></div>
                </div>
                <div class="flex gap-2">
                    <div class="w-1/2 campo-container"><span class="rotulo">CNPJ:</span><span class="linha-preenchimento"></span></div>
                    <div class="w-1/2 campo-container"><span class="rotulo">TELEFONE:</span><span class="linha-preenchimento"></span></div>
                </div>
            </div>
            <p class="border-t-2 border-black text-center mt-4 pt-1">ASSINATURA FARMACÊUTICO(A)</p>
        </div>
    </div>
    <p class="text-center text-xs mt-2">VERSÃO 2.0 | ABRIL DE 2020</p>
</body>
</html>`;

    // Renderiza o template EJS
    console.log('🔄 Renderizando template EJS...');
    const htmlContent = ejs.render(templateContent, { data: templateData });
    console.log('✅ Template renderizado com sucesso');

    // Inicia o Puppeteer (configuração para Vercel)
    console.log('🤖 Iniciando Puppeteer...');
    console.log('🌍 Ambiente de produção:', isProduction);
    
    let browser;
    if (isProduction) {
      // Configuração para Vercel/produção com Chromium
      console.log('🔧 Configurando Chromium para produção...');
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Configuração para desenvolvimento local
      console.log('🔧 Configurando Puppeteer para desenvolvimento...');
      const puppeteerLocal = require('puppeteer');
      browser = await puppeteerLocal.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    
    console.log('✅ Puppeteer iniciado');
    
    const page = await browser.newPage();
    console.log('📄 Nova página criada');
    
    // Configura timeout mais longo para CDN
    await page.setDefaultTimeout(30000);
    await page.setDefaultNavigationTimeout(30000);
    
    try {
      await page.setContent(htmlContent, { 
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 30000 
      });
      console.log('✅ Conteúdo definido na página');
    } catch (contentError) {
      console.log('⚠️ Erro no networkidle0, tentando com domcontentloaded...');
      await page.setContent(htmlContent, { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      console.log('✅ Conteúdo definido na página (fallback)');
    }

    // Gera o PDF
    console.log('📄 Gerando PDF...');
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

    // Retorna o PDF
    console.log('📤 Enviando PDF como resposta');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Erro detalhado:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Erro ao gerar o PDF', 
      details: error.message,
      stack: error.stack 
    });
  }
};
