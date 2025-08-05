import React, { useState } from 'react';
import ReceitaForm from './components/ReceitaForm'; // O formulário continua o mesmo

function App() {
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback de carregamento

  // A função que lida com a submissão do formulário foi totalmente modificada
  const handleGenerateAndPrint = async (formData) => {
    setIsLoading(true); // Ativa o estado de carregamento

    try {
      // Faz a requisição para o nosso backend
      const response = await fetch('http://localhost:4000/gerar-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envia os dados do formulário como JSON
      });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor.');
      }

      // Pega o PDF retornado como um "blob" (um tipo de dado de arquivo)
      const pdfBlob = await response.blob();

      // Cria uma URL temporária para o blob do PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Abre o PDF em uma nova aba do navegador
      window.open(pdfUrl, '_blank');

    } catch (error) {
      console.error('Erro ao chamar o backend:', error);
      alert('Não foi possível gerar o PDF. Verifique se o servidor backend está rodando.');
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento, mesmo se der erro
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            Gerador de Receituário Digital
          </h1>
          {/* O botão do formulário agora vai mostrar um feedback de carregamento */}
          {isLoading && <p className="text-blue-600 font-semibold mt-4 animate-pulse">Gerando PDF, por favor aguarde...</p>}
        </header>

        {/* Passamos a nova função para o formulário. O 'ReceitaPreview' foi removido! */}
        <ReceitaForm onGenerate={handleGenerateAndPrint} />
      </div>
    </div>
  );
}

export default App;