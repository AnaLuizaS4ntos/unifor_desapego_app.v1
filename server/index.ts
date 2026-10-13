import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import { authRouter } from './routes/authRoutes';
import { itemRouter } from './routes/itemRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração de CORS aberta e segura
// Permite requisições da Vercel e desenvolvimento local
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Health check para o Render
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'unidesapego-api',
  });
});

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/items', itemRouter);

// Tratamento de rotas não encontradas
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada na API.' });
});

async function startServer() {
  try {
    console.log('🔄 Conectando ao PostgreSQL e verificando tabelas...');
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor UniDesapego API rodando com sucesso na porta ${PORT}!`);
      console.log(`📡 Health Check disponível em: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Falha crítica ao iniciar o servidor:', err);
    process.exit(1);
  }
}

startServer();

