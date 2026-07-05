import { Router, Response } from 'express';
import pool from '../db/connection.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all CVs for current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, title, is_primary, created_at, updated_at FROM cv_data WHERE user_id = $1 ORDER BY is_primary DESC, updated_at DESC',
      [req.userId]
    );
    res.json({ cvs: result.rows });
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({ error: 'Gagal mengambil data CV' });
  }
});

// Get a single CV by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cv_data WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV tidak ditemukan' });
    }

    res.json({ cv: result.rows[0] });
  } catch (error) {
    console.error('Get CV error:', error);
    res.status(500).json({ error: 'Gagal mengambil data CV' });
  }
});

// Create new CV
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, cv_data, cv_settings } = req.body;

    // Check if user has any CVs - if not, make this primary
    const existingCVs = await pool.query(
      'SELECT id FROM cv_data WHERE user_id = $1',
      [req.userId]
    );
    const isPrimary = existingCVs.rows.length === 0;

    const result = await pool.query(
      `INSERT INTO cv_data (user_id, title, cv_data, cv_settings, is_primary) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.userId, title || 'Untitled CV', cv_data || {}, cv_settings || {}, isPrimary]
    );

    res.status(201).json({ cv: result.rows[0] });
  } catch (error) {
    console.error('Create CV error:', error);
    res.status(500).json({ error: 'Gagal membuat CV baru' });
  }
});

// Update CV data
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, cv_data, cv_settings, is_primary } = req.body;
    const { id } = req.params;

    // Verify ownership
    const existing = await pool.query(
      'SELECT id FROM cv_data WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'CV tidak ditemukan' });
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (cv_data !== undefined) {
      updates.push(`cv_data = $${paramIndex++}`);
      values.push(cv_data);
    }
    if (cv_settings !== undefined) {
      updates.push(`cv_settings = $${paramIndex++}`);
      values.push(cv_settings);
    }
    if (is_primary !== undefined) {
      // If setting as primary, unset all other primaries for this user
      if (is_primary) {
        await pool.query('UPDATE cv_data SET is_primary = false WHERE user_id = $1', [req.userId]);
      }
      updates.push(`is_primary = $${paramIndex++}`);
      values.push(is_primary);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Tidak ada data yang diupdate' });
    }

    values.push(id, req.userId);
    const result = await pool.query(
      `UPDATE cv_data SET ${updates.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING *`,
      values
    );

    res.json({ cv: result.rows[0] });
  } catch (error) {
    console.error('Update CV error:', error);
    res.status(500).json({ error: 'Gagal mengupdate CV' });
  }
});

// Delete CV
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if it's primary
    const cv = await pool.query(
      'SELECT is_primary FROM cv_data WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (cv.rows.length === 0) {
      return res.status(404).json({ error: 'CV tidak ditemukan' });
    }

    await pool.query('DELETE FROM cv_data WHERE id = $1 AND user_id = $2', [id, req.userId]);

    // If deleted CV was primary, set another as primary
    if (cv.rows[0].is_primary) {
      const nextCV = await pool.query(
        'SELECT id FROM cv_data WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [req.userId]
      );
      if (nextCV.rows.length > 0) {
        await pool.query('UPDATE cv_data SET is_primary = true WHERE id = $1', [nextCV.rows[0].id]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({ error: 'Gagal menghapus CV' });
  }
});

// Duplicate CV
router.post('/:id/duplicate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const source = await pool.query(
      'SELECT * FROM cv_data WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (source.rows.length === 0) {
      return res.status(404).json({ error: 'CV sumber tidak ditemukan' });
    }

    const sourceCV = source.rows[0];
    const result = await pool.query(
      `INSERT INTO cv_data (user_id, title, cv_data, cv_settings, is_primary) 
       VALUES ($1, $2, $3, $4, false) RETURNING *`,
      [req.userId, `${sourceCV.title} (Copy)`, sourceCV.cv_data, sourceCV.cv_settings]
    );

    res.status(201).json({ cv: result.rows[0] });
  } catch (error) {
    console.error('Duplicate CV error:', error);
    res.status(500).json({ error: 'Gagal menduplikasi CV' });
  }
});

// Rename CV
router.patch('/:id/rename', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    if (!title) {
      return res.status(400).json({ error: 'Judul harus diisi' });
    }

    const result = await pool.query(
      'UPDATE cv_data SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [title, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV tidak ditemukan' });
    }

    res.json({ cv: result.rows[0] });
  } catch (error) {
    console.error('Rename CV error:', error);
    res.status(500).json({ error: 'Gagal mengganti nama CV' });
  }
});

// Set primary CV
router.patch('/:id/primary', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Unset all primaries
    await pool.query('UPDATE cv_data SET is_primary = false WHERE user_id = $1', [req.userId]);

    // Set new primary
    const result = await pool.query(
      'UPDATE cv_data SET is_primary = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV tidak ditemukan' });
    }

    res.json({ cv: result.rows[0] });
  } catch (error) {
    console.error('Set primary error:', error);
    res.status(500).json({ error: 'Gagal mengatur CV utama' });
  }
});

// Admin: Get all users and their CV counts
router.get('/admin/users', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak' });
    }

    const result = await pool.query(`
      SELECT u.id, u.email, u.full_name, u.role, u.created_at,
             COUNT(cv.id) as cv_count
      FROM users u
      LEFT JOIN cv_data cv ON u.id = cv.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Gagal mengambil data users' });
  }
});

export default router;