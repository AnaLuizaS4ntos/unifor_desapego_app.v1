import { Router } from 'express';
import { pool } from '../db';
import { authenticateToken, optionalAuth, AuthenticatedRequest } from '../auth';
import { INITIAL_MARKETPLACE_ITEMS } from '../../src/data/mockItems';

export const itemRouter = Router();

/**
 * Função para popular os dados de exemplo caso o banco de dados esteja vazio
 */
async function seedInitialItemsIfNeeded() {
  const countRes = await pool.query('SELECT COUNT(*) FROM items');
  if (parseInt(countRes.rows[0].count, 10) > 0) return;

  console.log('🌱 Populando itens de exemplo no banco de dados...');
  for (const item of INITIAL_MARKETPLACE_ITEMS) {
    // 1. Cria usuário vendedor caso não exista
    const sellerEmail = `${item.seller.name.toLowerCase().replace(/\s+/g, '')}@edu.unifor.br`;
    let userRes = await pool.query('SELECT id FROM users WHERE email = $1', [sellerEmail]);
    let sellerId: string;

    if (userRes.rows.length === 0) {
      sellerId = `seed_usr_${Math.random().toString(36).slice(2, 8)}`;
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, course, semester, whatsapp, avatar_url, verified_student)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          sellerId,
          item.seller.name,
          sellerEmail,
          '$2a$10$seedMockPasswordHashNotForRealLogin',
          item.seller.course,
          item.seller.semester,
          item.seller.whatsapp,
          item.seller.avatarUrl || null,
          item.seller.verifiedStudent,
        ]
      );
    } else {
      sellerId = userRes.rows[0].id;
    }

    // 2. Insere item
    await pool.query(
      `INSERT INTO items (id, title, description, price, is_donation, category, condition, location, images, seller_id, views, published_at, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO NOTHING`,
      [
        item.id,
        item.title,
        item.description,
        item.price,
        item.isDonation,
        item.category,
        item.condition,
        item.location,
        item.images,
        sellerId,
        item.views || 0,
        item.publishedAt,
        item.tags,
      ]
    );
  }
  console.log('✅ Itens de exemplo populados com sucesso!');
}

// GET /api/items (Listagem com filtros, contagem e ordenação)
itemRouter.get('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await seedInitialItemsIfNeeded();

    const {
      q,
      category,
      bloco,
      condition,
      sortBy = 'recent',
      onlyFavorites,
    } = req.query;

    const currentUserId = req.user?.userId;

    let queryText = `
      SELECT 
        i.id,
        i.title,
        i.description,
        i.price,
        i.is_donation AS "isDonation",
        i.category,
        i.condition,
        i.location,
        i.images,
        i.views,
        i.published_at AS "publishedAt",
        i.tags,
        u.name AS "sellerName",
        u.course AS "sellerCourse",
        u.semester AS "sellerSemester",
        u.whatsapp AS "sellerWhatsapp",
        u.avatar_url AS "sellerAvatarUrl",
        u.verified_student AS "sellerVerifiedStudent",
        (SELECT COUNT(*) FROM favorites f WHERE f.item_id = i.id) AS "favoritesCount",
        CASE 
          WHEN $1::text IS NOT NULL AND EXISTS(SELECT 1 FROM favorites fav WHERE fav.item_id = i.id AND fav.user_id = $1::text) 
          THEN TRUE 
          ELSE FALSE 
        END AS "isFavorite"
      FROM items i
      LEFT JOIN users u ON i.seller_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [currentUserId || null];
    let paramIndex = 2;

    if (q && typeof q === 'string' && q.trim()) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      queryText += ` AND (
        LOWER(i.title) LIKE $${paramIndex} OR 
        LOWER(i.description) LIKE $${paramIndex} OR 
        LOWER(i.category) LIKE $${paramIndex} OR 
        LOWER(i.location) LIKE $${paramIndex} OR 
        LOWER(u.name) LIKE $${paramIndex} OR 
        LOWER(u.course) LIKE $${paramIndex}
      )`;
      params.push(searchTerm);
      paramIndex++;
    }

    if (category && typeof category === 'string' && category !== 'Todos') {
      if (category === 'Doação') {
        queryText += ` AND i.is_donation = TRUE`;
      } else {
        queryText += ` AND i.category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }
    }

    if (bloco && typeof bloco === 'string' && bloco !== 'Todos') {
      queryText += ` AND i.location = $${paramIndex}`;
      params.push(bloco);
      paramIndex++;
    }

    if (condition && typeof condition === 'string' && condition !== 'Todos') {
      queryText += ` AND i.condition = $${paramIndex}`;
      params.push(condition);
      paramIndex++;
    }

    if (onlyFavorites === 'true' && currentUserId) {
      queryText += ` AND EXISTS(SELECT 1 FROM favorites fav WHERE fav.item_id = i.id AND fav.user_id = $1::text)`;
    }

    // Ordenação
    if (sortBy === 'price-asc') {
      queryText += ` ORDER BY i.price ASC, i.published_at DESC`;
    } else if (sortBy === 'price-desc') {
      queryText += ` ORDER BY i.price DESC, i.published_at DESC`;
    } else if (sortBy === 'popular') {
      queryText += ` ORDER BY "favoritesCount" DESC, i.views DESC, i.published_at DESC`;
    } else {
      queryText += ` ORDER BY i.published_at DESC`;
    }

    const result = await pool.query(queryText, params);

    // Contadores de categorias
    const countsRes = await pool.query(`
      SELECT 
        COUNT(*) AS "total",
        COUNT(*) FILTER (WHERE is_donation = TRUE) AS "doacoes",
        COUNT(*) FILTER (WHERE category = 'Eletrônicos & Hardware') AS "eletronicos",
        COUNT(*) FILTER (WHERE category = 'Livros & Apostilas') AS "livros",
        COUNT(*) FILTER (WHERE category = 'Saúde & Jalecos') AS "saude",
        COUNT(*) FILTER (WHERE category = 'Móveis & Kitnet') AS "moveis",
        COUNT(*) FILTER (WHERE category = 'Jogos & Lazer') AS "jogos",
        COUNT(*) FILTER (WHERE category = 'Outros') AS "outros"
      FROM items
    `);

    const c = countsRes.rows[0];
    const categoryCounts: Record<string, number> = {
      Todos: parseInt(c.total || '0', 10),
      Doação: parseInt(c.doacoes || '0', 10),
      'Eletrônicos & Hardware': parseInt(c.eletronicos || '0', 10),
      'Livros & Apostilas': parseInt(c.livros || '0', 10),
      'Saúde & Jalecos': parseInt(c.saude || '0', 10),
      'Móveis & Kitnet': parseInt(c.moveis || '0', 10),
      'Jogos & Lazer': parseInt(c.jogos || '0', 10),
      Outros: parseInt(c.outros || '0', 10),
    };

    const formattedItems = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: Number(row.price),
      isDonation: Boolean(row.isDonation),
      category: row.category,
      condition: row.condition,
      location: row.location,
      images: row.images,
      seller: {
        name: row.sellerName || 'Estudante UNIFOR',
        course: row.sellerCourse || '',
        semester: row.sellerSemester || 'Ativo',
        whatsapp: row.sellerWhatsapp || '',
        avatarUrl: row.sellerAvatarUrl || undefined,
        verifiedStudent: Boolean(row.sellerVerifiedStudent),
      },
      publishedAt: Number(row.publishedAt),
      views: Number(row.views),
      favoritesCount: Number(row.favoritesCount),
      tags: row.tags || [],
      isFavorite: Boolean(row.isFavorite),
    }));

    return res.json({
      items: formattedItems,
      categoryCounts,
    });
  } catch (err) {
    console.error('Erro ao buscar itens:', err);
    return res.status(500).json({ error: 'Erro ao carregar anúncios.' });
  }
});

// POST /api/items (Cadastrar novo item)
itemRouter.post('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      price,
      isDonation,
      category,
      condition,
      location,
      images,
      seller,
    } = req.body;

    if (!title || !category || !condition || !location) {
      return res.status(400).json({ error: 'Dados obrigatórios faltando.' });
    }

    let sellerId = req.user?.userId;

    // Se o usuário não estiver com token JWT, criamos ou reutilizamos pelo whatsapp/nome
    if (!sellerId) {
      const sellerName = seller?.name?.trim() || 'Estudante UNIFOR';
      const sellerWhatsapp = (seller?.whatsapp || '').replace(/\D/g, '') || '5585999887766';
      const dummyEmail = `temp_${sellerWhatsapp}@unidesapego.local`;

      let uRes = await pool.query('SELECT id FROM users WHERE email = $1', [dummyEmail]);
      if (uRes.rows.length === 0) {
        sellerId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, course, semester, whatsapp, verified_student)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            sellerId,
            sellerName,
            dummyEmail,
            'guest_no_password',
            seller?.course?.trim() || 'UNIFOR',
            seller?.semester || 'Ativo',
            sellerWhatsapp,
            false,
          ]
        );
      } else {
        sellerId = uRes.rows[0].id;
      }
    }

    const itemId = `unifor-item-${Date.now()}`;
    const publishedAt = Date.now();
    const finalPrice = isDonation ? 0 : Math.max(0, Number(price) || 0);
    const finalImages = Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'];
    const tags = [category.toLowerCase(), location.toLowerCase(), ...(isDonation ? ['doacao'] : [])];

    await pool.query(
      `INSERT INTO items (id, title, description, price, is_donation, category, condition, location, images, seller_id, views, published_at, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        itemId,
        title.trim(),
        description?.trim() || '',
        finalPrice,
        Boolean(isDonation || finalPrice === 0),
        category,
        condition,
        location,
        finalImages,
        sellerId,
        1,
        publishedAt,
        tags,
      ]
    );

    return res.status(201).json({
      message: 'Item criado com sucesso!',
      itemId,
    });
  } catch (err) {
    console.error('Erro ao criar item:', err);
    return res.status(500).json({ error: 'Erro interno ao salvar item.' });
  }
});

// POST /api/items/:id/view (Contador real de visualizações com incremento atômico no banco)
itemRouter.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE items SET views = views + 1 WHERE id = $1 RETURNING views',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    return res.json({ views: result.rows[0].views });
  } catch (err) {
    console.error('Erro ao incrementar visualização:', err);
    return res.status(500).json({ error: 'Erro ao atualizar visualizações.' });
  }
});

// POST /api/items/:id/favorite (Toggle de favorito sincronizado com banco)
itemRouter.post('/:id/favorite', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await pool.query(
      'SELECT 1 FROM favorites WHERE user_id = $1 AND item_id = $2',
      [userId, id]
    );

    let isFavorite: boolean;
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND item_id = $2', [userId, id]);
      isFavorite = false;
    } else {
      await pool.query(
        'INSERT INTO favorites (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, id]
      );
      isFavorite = true;
    }

    const countRes = await pool.query('SELECT COUNT(*) FROM favorites WHERE item_id = $1', [id]);
    const favoritesCount = parseInt(countRes.rows[0].count, 10);

    return res.json({ isFavorite, favoritesCount });
  } catch (err) {
    console.error('Erro no toggle de favoritos:', err);
    return res.status(500).json({ error: 'Erro ao atualizar favoritos.' });
  }
});

