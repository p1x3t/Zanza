import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDatabase() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      phone TEXT,
      google_id TEXT,
      avatar_url TEXT,
      is_professional BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS establishments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      
      -- Endereço estruturado (Brasil)
      cep TEXT,
      street TEXT,
      number TEXT,
      complement TEXT,
      neighborhood TEXT,
      city TEXT,
      state TEXT,
      country TEXT DEFAULT 'BR',
      
      -- Coordenadas (preenchidas automaticamente)
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      
      -- Metadados de geocoding
      geocoding_status TEXT DEFAULT 'pending',
      geocoding_source TEXT,
      full_address TEXT,
      
      description TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      establishment_id INTEGER,
      name TEXT NOT NULL,
      duration_minutes INTEGER,
      price DECIMAL(10,2),
      description TEXT,
      FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      establishment_id INTEGER,
      service_id INTEGER,
      scheduled_date DATE,
      scheduled_time TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (establishment_id) REFERENCES establishments(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );

    CREATE INDEX IF NOT EXISTS idx_establishments_location ON establishments(latitude, longitude);
    CREATE INDEX IF NOT EXISTS idx_establishments_city ON establishments(city, state);
  `);

  return db;
}