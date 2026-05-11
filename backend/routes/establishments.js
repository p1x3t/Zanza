import express from 'express';
import { geocodeAddress } from '../utils/geocoding.js';
import { authenticate } from './auth.js';

const router = express.Router();

// Listar estabelecimentos próximos
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, service } = req.query;
    
    let query = `
      SELECT e.*, 
             (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
             cos(radians(longitude) - radians(?)) + 
             sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM establishments e
      WHERE geocoding_status = 'success'
    `;
    const params = [lat, lng, lat];

    if (service) {
      query += ` AND e.id IN (
        SELECT establishment_id FROM services WHERE name LIKE ?
      )`;
      params.push(`%${service}%`);
    }

    query += ` HAVING distance <= ? ORDER BY distance LIMIT 50`;
    params.push(radius);

    const establishments = await global.db.all(query, params);
    res.json(establishments);
  } catch (error) {
    console.error('List establishments error:', error);
    res.status(500).json({ error: 'Erro ao buscar estabelecimentos' });
  }
});

// Criar estabelecimento (cadastro por endereço)
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      name, cep, street, number, complement, neighborhood, city, state,
      description, phone, services
    } = req.body;

    if (!name || !street || !city || !state) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Geocoding automático
    const geo = await geocodeAddress({ cep, street, number, neighborhood, city, state });
    
    const fullAddress = [street, number, neighborhood, city, state].filter(Boolean).join(', ');

    const result = await global.db.run(`
      INSERT INTO establishments 
      (user_id, name, cep, street, number, complement, neighborhood, city, state,
       latitude, longitude, geocoding_status, geocoding_source, full_address, description, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.userId, name, cep, street, number, complement, neighborhood, city, state,
      geo?.latitude, geo?.longitude, geo ? 'success' : 'pending', geo?.source, fullAddress, description, phone
    ]);

    // Inserir serviços
    if (services?.length) {
      for (const svc of services) {
        await global.db.run(
          'INSERT INTO services (establishment_id, name, duration_minutes, price) VALUES (?, ?, ?, ?)',
          [result.lastID, svc.name, svc.duration, svc.price]
        );
      }
    }

    const establishment = await global.db.get('SELECT * FROM establishments WHERE id = ?', [result.lastID]);
    res.status(201).json(establishment);
  } catch (error) {
    console.error('Create establishment error:', error);
    res.status(500).json({ error: 'Erro ao cadastrar estabelecimento' });
  }
});

// Atualizar estabelecimento
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, phone, services } = req.body;

    // Verificar propriedade
    const estab = await global.db.get('SELECT * FROM establishments WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (!estab) return res.status(403).json({ error: 'Não autorizado' });

    await global.db.run(
      'UPDATE establishments SET name = COALESCE(?, name), description = COALESCE(?, description), phone = COALESCE(?, phone), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, phone, id]
    );

    // Atualizar serviços (simplificado: remove e reinsere)
    if (services?.length) {
      await global.db.run('DELETE FROM services WHERE establishment_id = ?', [id]);
      for (const svc of services) {
        await global.db.run(
          'INSERT INTO services (establishment_id, name, duration_minutes, price) VALUES (?, ?, ?, ?)',
          [id, svc.name, svc.duration, svc.price]
        );
      }
    }

    const updated = await global.db.get('SELECT * FROM establishments WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    console.error('Update establishment error:', error);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

// Buscar detalhes
router.get('/:id', async (req, res) => {
  try {
    const establishment = await global.db.get('SELECT * FROM establishments WHERE id = ?', [req.params.id]);
    if (!establishment) return res.status(404).json({ error: 'Não encontrado' });

    const services = await global.db.all('SELECT * FROM services WHERE establishment_id = ?', [req.params.id]);
    res.json({ ...establishment, services });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes' });
  }
});

export default router;