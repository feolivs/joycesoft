const axios = require('axios');
const { getConfig } = require('./environment');

// Configuração do cliente WhatsApp
const whatsappConfig = getConfig('whatsapp');

const whatsappClient = axios.create({
  baseURL: `https://graph.facebook.com/v17.0/${whatsappConfig.phoneNumberId}`,
  headers: {
    'Authorization': `Bearer ${whatsappConfig.apiKey}`,
    'Content-Type': 'application/json'
  }
});

// Funções auxiliares para operações comuns no WhatsApp

const sendMessage = async (to, message) => {
  try {
    const response = await whatsappClient.post('/messages', {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: {
        body: message
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao enviar mensagem: ${error.message}`);
  }
};

const sendTemplate = async (to, templateName, languageCode, components) => {
  try {
    const response = await whatsappClient.post('/messages', {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode
        },
        components: components
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao enviar template: ${error.message}`);
  }
};

const sendMedia = async (to, mediaUrl, caption) => {
  try {
    const response = await whatsappClient.post('/messages', {
      messaging_product: 'whatsapp',
      to: to,
      type: 'image',
      image: {
        link: mediaUrl,
        caption: caption
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao enviar mídia: ${error.message}`);
  }
};

// Funções específicas do sistema

const sendInvoiceNotification = async (clientPhone, invoiceData) => {
  const message = `Olá! Sua fatura #${invoiceData.number} foi gerada.\n\n` +
    `Valor: R$ ${invoiceData.value}\n` +
    `Vencimento: ${invoiceData.dueDate}\n\n` +
    `Para visualizar e pagar, acesse: ${invoiceData.paymentUrl}`;

  return sendMessage(clientPhone, message);
};

const sendPaymentConfirmation = async (clientPhone, paymentData) => {
  const message = `Olá! Seu pagamento foi confirmado.\n\n` +
    `Fatura: #${paymentData.invoiceNumber}\n` +
    `Valor: R$ ${paymentData.value}\n` +
    `Data: ${paymentData.date}\n` +
    `Método: ${paymentData.method}`;

  return sendMessage(clientPhone, message);
};

const sendTaskReminder = async (clientPhone, taskData) => {
  const message = `Olá! Lembrete de tarefa:\n\n` +
    `Título: ${taskData.title}\n` +
    `Descrição: ${taskData.description}\n` +
    `Prazo: ${taskData.dueDate}\n\n` +
    `Para mais detalhes, acesse: ${taskData.detailsUrl}`;

  return sendMessage(clientPhone, message);
};

const sendWelcomeMessage = async (clientPhone, clientName) => {
  const message = `Olá ${clientName}! Bem-vindo(a) ao JoyceSoft.\n\n` +
    `Estamos muito felizes em tê-lo(a) como cliente.\n` +
    `Para começar, acesse nosso portal: ${process.env.PORTAL_URL}\n\n` +
    `Em caso de dúvidas, estamos à disposição!`;

  return sendMessage(clientPhone, message);
};

module.exports = {
  whatsappClient,
  sendMessage,
  sendTemplate,
  sendMedia,
  sendInvoiceNotification,
  sendPaymentConfirmation,
  sendTaskReminder,
  sendWelcomeMessage
}; 