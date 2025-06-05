const axios = require('axios');

// Configuração da NFe.io
const nfeConfig = {
  baseURL: 'https://api.nfe.io/v1',
  headers: {
    'Authorization': `Bearer ${process.env.NFE_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

const nfeClient = axios.create(nfeConfig);

// Configuração da Asaas
const asaasConfig = {
  baseURL: 'https://api.asaas.com/v3',
  headers: {
    'access_token': process.env.ASAAS_API_KEY,
    'Content-Type': 'application/json'
  }
};

const asaasClient = axios.create(asaasConfig);

// Configuração do Google Drive
const googleDriveConfig = {
  clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI,
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata'
  ]
};

// Configuração do WhatsApp
const whatsappConfig = {
  apiKey: process.env.WHATSAPP_API_KEY,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
};

// Funções auxiliares para integrações

// NFe.io
const emitirNotaFiscal = async (dados) => {
  try {
    const response = await nfeClient.post('/companies', dados);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao emitir nota fiscal: ${error.message}`);
  }
};

const cancelarNotaFiscal = async (nfeId) => {
  try {
    const response = await nfeClient.post(`/companies/${nfeId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao cancelar nota fiscal: ${error.message}`);
  }
};

// Asaas
const criarCobranca = async (dados) => {
  try {
    const response = await asaasClient.post('/payments', dados);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar cobrança: ${error.message}`);
  }
};

const gerarPix = async (paymentId) => {
  try {
    const response = await asaasClient.post(`/payments/${paymentId}/pixQrCode`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao gerar Pix: ${error.message}`);
  }
};

// Google Drive
const criarPasta = async (nome, parentId = null) => {
  try {
    const response = await axios.post('https://www.googleapis.com/drive/v3/files', {
      name: nome,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_DRIVE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar pasta no Drive: ${error.message}`);
  }
};

const uploadArquivo = async (nome, conteudo, mimeType, parentId = null) => {
  try {
    const response = await axios.post('https://www.googleapis.com/upload/drive/v3/files', {
      name: nome,
      parents: parentId ? [parentId] : []
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_DRIVE_ACCESS_TOKEN}`,
        'Content-Type': mimeType
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao fazer upload no Drive: ${error.message}`);
  }
};

// WhatsApp
const enviarMensagemWhatsApp = async (numero, mensagem) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${whatsappConfig.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: numero,
        type: 'text',
        text: { body: mensagem }
      },
      {
        headers: {
          'Authorization': `Bearer ${whatsappConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao enviar mensagem no WhatsApp: ${error.message}`);
  }
};

module.exports = {
  nfeClient,
  asaasClient,
  googleDriveConfig,
  whatsappConfig,
  emitirNotaFiscal,
  cancelarNotaFiscal,
  criarCobranca,
  gerarPix,
  criarPasta,
  uploadArquivo,
  enviarMensagemWhatsApp
}; 