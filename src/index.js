require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');

// Importar rotas
const clientesRouter = require('./api/routes/clientes');
const notasFiscaisRouter = require('./api/routes/notas-fiscais');
const cobrancasRouter = require('./api/routes/cobrancas');
const tarefasRouter = require('./api/routes/tarefas');
const relatoriosRouter = require('./api/routes/relatorios');
const assistenteRouter = require('./api/routes/assistente');

const app = express();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rotas
app.use('/api/clientes', clientesRouter);
app.use('/api/notas-fiscais', notasFiscaisRouter);
app.use('/api/cobrancas', cobrancasRouter);
app.use('/api/tarefas', tarefasRouter);
app.use('/api/relatorios', relatoriosRouter);
app.use('/api/assistente', assistenteRouter);

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao JoyceSoft - Sistema Contábil Inteligente' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 