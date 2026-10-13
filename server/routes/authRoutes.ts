import { Router } from 'express';
import { pool } from '../db';
import { hashPassword, comparePassword, generateToken, authenticateToken, AuthenticatedRequest } from '../auth';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, course, semester, whatsapp, avatarUrl } = req.body;

    if (!name || !email || !password || !course || !whatsapp) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');

    // Verifica se já existe esse e-mail
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // Aluno verificado se o e-mail for institucional UNIFOR
    const isUnifor = cleanEmail.endsWith('@unifor.br') || cleanEmail.endsWith('@edu.unifor.br');
    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`;

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, course, semester, whatsapp, avatar_url, verified_student)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        name.trim(),
        cleanEmail,
        passwordHash,
        course.trim(),
        semester?.trim() || 'Ativo',
        cleanWhatsapp,
        finalAvatar,
        isUnifor,
      ]
    );

    const token = generateToken({ userId, email: cleanEmail, name: name.trim() });

    return res.status(201).json({
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        course: course.trim(),
        semester: semester?.trim() || 'Ativo',
        whatsapp: cleanWhatsapp,
        avatarUrl: finalAvatar,
        verifiedStudent: isUnifor,
      },
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await pool.query(
      `SELECT id, name, email, password_hash, course, semester, whatsapp, avatar_url, verified_student
       FROM users WHERE email = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const userRow = result.rows[0];
    const passwordMatch = await comparePassword(password, userRow.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = generateToken({ userId: userRow.id, email: userRow.email, name: userRow.name });

    return res.json({
      token,
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        course: userRow.course,
        semester: userRow.semester,
        whatsapp: userRow.whatsapp,
        avatarUrl: userRow.avatar_url,
        verifiedStudent: userRow.verified_student,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

// GET /api/auth/me (obter dados do usuário autenticado)
authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    const result = await pool.query(
      `SELECT id, name, email, course, semester, whatsapp, avatar_url, verified_student
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const row = result.rows[0];
    return res.json({
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        course: row.course,
        semester: row.semester,
        whatsapp: row.whatsapp,
        avatarUrl: row.avatar_url,
        verifiedStudent: row.verified_student,
      },
    });
  } catch (err) {
    console.error('Erro no /me:', err);
    return res.status(500).json({ error: 'Erro ao obter dados do usuário.' });
  }
});

