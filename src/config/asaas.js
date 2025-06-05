const axios = require('axios');
const { getConfig } = require('./environment');

// Configuração do cliente Asaas
const asaasConfig = getConfig('asaas');

const asaasClient = axios.create({
  baseURL: asaasConfig.url,
  headers: {
    'access_token': asaasConfig.key,
    'Content-Type': 'application/json'
  }
});

// Funções auxiliares para operações comuns no Asaas

const createCustomer = async (customerData) => {
  try {
    const response = await asaasClient.post('/customers', customerData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar cliente: ${error.message}`);
  }
};

const createPayment = async (paymentData) => {
  try {
    const response = await asaasClient.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar pagamento: ${error.message}`);
  }
};

const getPayment = async (id) => {
  try {
    const response = await asaasClient.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar pagamento: ${error.message}`);
  }
};

const cancelPayment = async (id) => {
  try {
    const response = await asaasClient.post(`/payments/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao cancelar pagamento: ${error.message}`);
  }
};

const createInstallment = async (installmentData) => {
  try {
    const response = await asaasClient.post('/installments', installmentData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar parcelamento: ${error.message}`);
  }
};

const getInstallment = async (id) => {
  try {
    const response = await asaasClient.get(`/installments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar parcelamento: ${error.message}`);
  }
};

// Funções específicas do sistema

const createBoletoPayment = async (customerId, invoiceData) => {
  const paymentData = {
    customer: customerId,
    billingType: 'BOLETO',
    value: invoiceData.value,
    dueDate: invoiceData.dueDate,
    description: invoiceData.description,
    externalReference: invoiceData.externalReference
  };

  return createPayment(paymentData);
};

const createPixPayment = async (customerId, invoiceData) => {
  const paymentData = {
    customer: customerId,
    billingType: 'PIX',
    value: invoiceData.value,
    dueDate: invoiceData.dueDate,
    description: invoiceData.description,
    externalReference: invoiceData.externalReference
  };

  return createPayment(paymentData);
};

const createCreditCardPayment = async (customerId, invoiceData, creditCardData) => {
  const paymentData = {
    customer: customerId,
    billingType: 'CREDIT_CARD',
    value: invoiceData.value,
    dueDate: invoiceData.dueDate,
    description: invoiceData.description,
    externalReference: invoiceData.externalReference,
    creditCard: {
      holderName: creditCardData.holderName,
      number: creditCardData.number,
      expiryMonth: creditCardData.expiryMonth,
      expiryYear: creditCardData.expiryYear,
      ccv: creditCardData.ccv
    },
    creditCardHolderInfo: {
      name: creditCardData.holderName,
      email: creditCardData.email,
      cpfCnpj: creditCardData.cpfCnpj,
      postalCode: creditCardData.postalCode,
      addressNumber: creditCardData.addressNumber,
      addressComplement: creditCardData.addressComplement,
      phone: creditCardData.phone
    }
  };

  return createPayment(paymentData);
};

module.exports = {
  asaasClient,
  createCustomer,
  createPayment,
  getPayment,
  cancelPayment,
  createInstallment,
  getInstallment,
  createBoletoPayment,
  createPixPayment,
  createCreditCardPayment
}; 