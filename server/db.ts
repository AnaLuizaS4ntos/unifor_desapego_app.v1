import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Conexão com PostgreSQL
// Aceita tanto a DATABASE_URL (padrão no Render e Neon/Supabase) quanto variáveis individuais
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'unidesapego',
      }
);

/**
 * Criação automática das tabelas necessárias caso não existam
 */
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Tabela de Usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(160) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        course VARCHAR(120) NOT NULL,
        semester VARCHAR(60) DEFAULT 'Ativo',
        whatsapp VARCHAR(30) NOT NULL,
        avatar_url TEXT,
        verified_student BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de Itens / Desapegos
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(160) NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        is_donation BOOLEAN NOT NULL DEFAULT FALSE,
        category VARCHAR(80) NOT NULL,
        condition VARCHAR(80) NOT NULL,
        location VARCHAR(80) NOT NULL,
        images TEXT[] NOT NULL DEFAULT '{}',
        seller_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        views INTEGER NOT NULL DEFAULT 0,
        published_at BIGINT NOT NULL,
        tags TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de Favoritos (Relacionamento Usuário x Item)
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        item_id VARCHAR(64) REFERENCES items(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, item_id)
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Banco de dados PostgreSQL inicializado com sucesso!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao inicializar tabelas do banco de dados:', err);
    throw err;
  } finally {
    client.release();
  }
}

