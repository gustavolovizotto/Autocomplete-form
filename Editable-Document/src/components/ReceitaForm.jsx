import React, { useState, useEffect } from 'react';

function ReceitaForm({ onGenerate }) {
  const [formData, setFormData] = useState({
    // Dados do Emitente
    nomeMedico: 'DRA. RITA DE CASSIA LOVIZOTTO',
    crm: '154792', crmUf: 'SP',
    enderecoMedico: 'RUA CARLOS GOMES, 592',
    cidadeMedico: 'GUARARAPES', cidadeUf: 'SP',
    telefoneMedico: '18 998160303', data: '',
    // Dados do Paciente e Prescrição
    paciente: '',
    enderecoPaciente: '',
    prescricao: '',
    // Dados do Comprador
    comprador: { nome: '', rg: '', orgaoEmissor: '', endereco: '', cidade: '', uf: '', telefone: '' },
    // Dados do Fornecedor
    fornecedor: { nomeFarmaceutico: '', crf: '', crfUf: '', nomeFarmacia: '', endereco: '', cidade: '', uf: '', cnpj: '', telefone: '' }
  });

  useEffect(() => {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString('pt-BR');
    setFormData(prev => ({ ...prev, data: dataFormatada }));
  }, []);

  // Função atualizada para lidar com objetos aninhados (ex: comprador.nome)
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length === 2) { // Se for um campo aninhado como "comprador.nome"
      const [section, field] = keys;
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else { // Se for um campo normal
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.paciente || !formData.prescricao) {
      alert('Por favor, preencha pelo menos o nome do paciente e a prescrição.');
      return;
    }
    onGenerate(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        {/* ==================== EMITENTE ==================== */}
<fieldset className="border border-gray-300 p-4 rounded-lg mb-6">
  <legend className="text-lg font-semibold px-2">1. Identificação do Emitente</legend>

  {/* Usamos divs e spans para mostrar os dados fixos, e Tailwind para o layout */}
  <div className="space-y-3 text-sm">
    
    {/* Linha do Nome */}
    <div>
      <span className="font-bold">NOME COMPLETO:</span>
      <span> {formData.nomeMedico}</span>
    </div>

    {/* Linha do CRM e UF */}
    <div className="flex">
      <div className="w-1/2">
        <span className="font-bold">CRM:</span>
        <span> {formData.crm}</span>
      </div>
      <div className="w-1/2">
        <span className="font-bold">UF:</span>
        <span> {formData.crmUf}</span>
      </div>
    </div>

    {/* Linha do Endereço */}
    <div>
      <span className="font-bold">ENDEREÇO COMPLETO:</span>
      <span> {formData.enderecoMedico}</span>
    </div>
    
    {/* Linha da Cidade e UF */}
    <div className="flex">
      <div className="w-1/2">
        <span className="font-bold">CIDADE:</span>
        <span> {formData.cidadeMedico}</span>
      </div>
      <div className="w-1/2">
        <span className="font-bold">UF:</span>
        <span> {formData.cidadeUf}</span>
      </div>
    </div>
    
    {/* Linha do Telefone e DATA (único campo editável) */}
    <div className="flex items-center">
      <div className="w-1/2">
        <span className="font-bold">TELEFONE:</span>
        <span> {formData.telefoneMedico}</span>
      </div>
      <div className="w-1/2 flex items-center">
        <label htmlFor="data" className="font-bold mr-2">DATA:</label>
        <input
            type="text"
            name="data" // O nome do campo corresponde ao estado
            id="data"
            value={formData.data} // O valor vem do estado
            onChange={handleChange} // A função de mudança atualiza o estado
            className="shadow-sm appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

  </div>
</fieldset>

        {/* ==================== PACIENTE E PRESCRIÇÃO ==================== */}
        <fieldset className="border border-gray-300 p-4 rounded-lg mb-6">
          <legend className="text-lg font-semibold px-2">2. Paciente e Prescrição</legend>
          <div className="mb-4">
            <label htmlFor="paciente" className="block text-gray-700 text-sm font-bold mb-2">Nome do Paciente:</label>
            <input type="text" name="paciente" value={formData.paciente} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3"/>
          </div>
          <div className="mb-4">
            <label htmlFor="enderecoPaciente" className="block text-gray-700 text-sm font-bold mb-2">Endereço do Paciente:</label>
            <input type="text" name="enderecoPaciente" value={formData.enderecoPaciente} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3"/>
          </div>
          <div>
            <label htmlFor="prescricao" className="block text-gray-700 text-sm font-bold mb-2">Prescrição:</label>
            <textarea name="prescricao" rows="10" value={formData.prescricao} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3"/>
          </div>
        </fieldset>

        

        <div className="flex items-center justify-center mt-8">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline text-lg">
            Gerar Receituário
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceitaForm;