import { Router, Response } from 'express';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth.js';
import pool from '../db/connection.js';
import bcrypt from 'bcryptjs';

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// ==================== DASHBOARD STATS ====================
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const cvsCount = await pool.query('SELECT COUNT(*) FROM cv_data');
    const recentUsers = await pool.query(
      "SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days'"
    );
    const recentCvs = await pool.query(
      "SELECT COUNT(*) FROM cv_data WHERE created_at > NOW() - INTERVAL '7 days'"
    );
    const adminCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    const templatesCount = await pool.query('SELECT COUNT(*) FROM templates WHERE is_active = true');

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalCvs: parseInt(cvsCount.rows[0].count),
      recentUsers: parseInt(recentUsers.rows[0].count),
      recentCvs: parseInt(recentCvs.rows[0].count),
      totalAdmins: parseInt(adminCount.rows[0].count),
      activeTemplates: parseInt(templatesCount.rows[0].count),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== USER MANAGEMENT ====================
// Get all users
router.get('/users', async (_req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single user
router.get('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user
router.post('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at',
      [email, password_hash, full_name || '', role || 'user']
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, full_name, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user details
router.put('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, email, role, password } = req.body;

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    let query = 'UPDATE users SET updated_at = NOW()';
    const params: any[] = [];
    let paramIndex = 1;

    if (full_name !== undefined) {
      query += `, full_name = $${paramIndex++}`;
      params.push(full_name);
    }
    if (email !== undefined) {
      query += `, email = $${paramIndex++}`;
      params.push(email);
    }
    if (role !== undefined) {
      query += `, role = $${paramIndex++}`;
      params.push(role);
    }
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      query += `, password_hash = $${paramIndex++}`;
      params.push(password_hash);
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, email, full_name, role, created_at, updated_at`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (id === req.userId) {
      return res.status(400).json({ error: 'Tidak bisa menghapus akun sendiri' });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== CV MANAGEMENT ====================
// Get all CVs with user info
router.get('/cvs', async (_req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.email as user_email, u.full_name as user_name
      FROM cv_data c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.updated_at DESC
    `);
    res.json({ cvs: result.rows });
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a CV (admin)
router.delete('/cvs/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM cv_data WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV not found' });
    }

    res.json({ message: 'CV berhasil dihapus' });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== TEMPLATE MANAGEMENT ====================
// Get all templates
router.get('/templates', async (_req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM templates ORDER BY sort_order ASC, created_at DESC');
    res.json({ templates: result.rows });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create template
router.post('/templates', async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, category, is_active, sort_order, preview_image, config } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Nama dan slug template harus diisi' });
    }

    const existingSlug = await pool.query('SELECT id FROM templates WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
      return res.status(400).json({ error: 'Slug sudah digunakan' });
    }

    const result = await pool.query(
      `INSERT INTO templates (name, slug, description, category, is_active, sort_order, preview_image, config)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, slug, description || '', category || 'professional', is_active !== false, sort_order || 0, preview_image || '', config || '{}']
    );

    res.status(201).json({ template: result.rows[0] });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update template
router.put('/templates/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, category, is_active, sort_order, preview_image, config } = req.body;

    let query = 'UPDATE templates SET updated_at = NOW()';
    const params: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) { query += `, name = $${paramIndex++}`; params.push(name); }
    if (slug !== undefined) { query += `, slug = $${paramIndex++}`; params.push(slug); }
    if (description !== undefined) { query += `, description = $${paramIndex++}`; params.push(description); }
    if (category !== undefined) { query += `, category = $${paramIndex++}`; params.push(category); }
    if (is_active !== undefined) { query += `, is_active = $${paramIndex++}`; params.push(is_active); }
    if (sort_order !== undefined) { query += `, sort_order = $${paramIndex++}`; params.push(sort_order); }
    if (preview_image !== undefined) { query += `, preview_image = $${paramIndex++}`; params.push(preview_image); }
    if (config !== undefined) { query += `, config = $${paramIndex++}`; params.push(JSON.stringify(config)); }

    query += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template tidak ditemukan' });
    }

    res.json({ template: result.rows[0] });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete template
router.delete('/templates/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM templates WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template tidak ditemukan' });
    }

    res.json({ message: 'Template berhasil dihapus' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle template active status
router.patch('/templates/:id/toggle', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE templates SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template tidak ditemukan' });
    }

    res.json({ template: result.rows[0] });
  } catch (error) {
    console.error('Toggle template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;