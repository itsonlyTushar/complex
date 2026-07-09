import 'dotenv/config';
import pg from 'pg';

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'complex',
  password: process.env.DB_PASSWORD || 'tushar537',
  port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new pg.Pool(config);

async function main() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in local database:');
    if (res.rows.length === 0) {
      console.log('No tables found in public schema.');
    } else {
      res.rows.forEach(row => console.log(` - ${row.table_name}`));
    }
  } catch (err) {
    console.error('Failed to query tables:', err.message);
  } finally {
    await pool.end();
  }
}

main();
