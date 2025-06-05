// Configuração do ambiente
const environment = {
  development: {
    supabase: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY
    },
    n8n: {
      url: process.env.N8N_URL,
      key: process.env.N8N_API_KEY
    },
    weweb: {
      url: process.env.WEWEB_URL,
      key: process.env.WEWEB_API_KEY
    },
    nfe: {
      url: 'https://api.nfe.io/v1',
      key: process.env.NFE_API_KEY
    },
    asaas: {
      url: 'https://api.asaas.com/v3',
      key: process.env.ASAAS_API_KEY
    },
    openai: {
      url: 'https://api.openai.com/v1',
      key: process.env.OPENAI_API_KEY
    },
    google: {
      drive: {
        clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI
      }
    },
    whatsapp: {
      apiKey: process.env.WHATSAPP_API_KEY,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
    }
  },
  production: {
    supabase: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY
    },
    n8n: {
      url: process.env.N8N_URL,
      key: process.env.N8N_API_KEY
    },
    weweb: {
      url: process.env.WEWEB_URL,
      key: process.env.WEWEB_API_KEY
    },
    nfe: {
      url: 'https://api.nfe.io/v1',
      key: process.env.NFE_API_KEY
    },
    asaas: {
      url: 'https://api.asaas.com/v3',
      key: process.env.ASAAS_API_KEY
    },
    openai: {
      url: 'https://api.openai.com/v1',
      key: process.env.OPENAI_API_KEY
    },
    google: {
      drive: {
        clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI
      }
    },
    whatsapp: {
      apiKey: process.env.WHATSAPP_API_KEY,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
    }
  }
};

// Funções auxiliares

const getEnvironment = () => {
  return environment[process.env.NODE_ENV || 'development'];
};

const getConfig = (service) => {
  const env = getEnvironment();
  return env[service];
};

const validateConfig = () => {
  const env = getEnvironment();
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'N8N_URL',
    'N8N_API_KEY',
    'WEWEB_URL',
    'WEWEB_API_KEY',
    'NFE_API_KEY',
    'ASAAS_API_KEY',
    'OPENAI_API_KEY',
    'GOOGLE_DRIVE_CLIENT_ID',
    'GOOGLE_DRIVE_CLIENT_SECRET',
    'GOOGLE_DRIVE_REDIRECT_URI',
    'WHATSAPP_API_KEY',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_BUSINESS_ACCOUNT_ID'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
  }
};

module.exports = {
  getEnvironment,
  getConfig,
  validateConfig
}; 