const axios = require('axios');
const { getConfig } = require('./environment');

// Configuração do cliente NFe.io
const nfeConfig = getConfig('nfe');

const nfeClient = axios.create({
  baseURL: nfeConfig.url,
  headers: {
    'Authorization': `Bearer ${nfeConfig.key}`,
    'Content-Type': 'application/json'
  }
});

// Funções auxiliares para operações comuns no NFe.io

const createCompany = async (companyData) => {
  try {
    const response = await nfeClient.post('/companies', companyData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar empresa: ${error.message}`);
  }
};

const createInvoice = async (invoiceData) => {
  try {
    const response = await nfeClient.post('/invoices', invoiceData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar nota fiscal: ${error.message}`);
  }
};

const getInvoice = async (id) => {
  try {
    const response = await nfeClient.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar nota fiscal: ${error.message}`);
  }
};

const cancelInvoice = async (id, reason) => {
  try {
    const response = await nfeClient.post(`/invoices/${id}/cancel`, { reason });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao cancelar nota fiscal: ${error.message}`);
  }
};

const getInvoicePDF = async (id) => {
  try {
    const response = await nfeClient.get(`/invoices/${id}/pdf`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar PDF da nota fiscal: ${error.message}`);
  }
};

const getInvoiceXML = async (id) => {
  try {
    const response = await nfeClient.get(`/invoices/${id}/xml`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar XML da nota fiscal: ${error.message}`);
  }
};

// Funções específicas do sistema

const createNFeForClient = async (clientData, items, paymentInfo) => {
  const invoiceData = {
    company_id: process.env.NFE_COMPANY_ID,
    customer: {
      name: clientData.name,
      document: clientData.document,
      email: clientData.email,
      phone: clientData.phone,
      address: {
        street: clientData.address.street,
        number: clientData.address.number,
        complement: clientData.address.complement,
        district: clientData.address.district,
        city: clientData.address.city,
        state: clientData.address.state,
        zipcode: clientData.address.zipcode
      }
    },
    items: items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      ncm: item.ncm,
      cfop: item.cfop
    })),
    payment: {
      method: paymentInfo.method,
      installments: paymentInfo.installments
    }
  };

  return createInvoice(invoiceData);
};

module.exports = {
  nfeClient,
  createCompany,
  createInvoice,
  getInvoice,
  cancelInvoice,
  getInvoicePDF,
  getInvoiceXML,
  createNFeForClient
}; 