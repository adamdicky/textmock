// test-db.mjs
import pg from 'pg';
const { Client } = pg;

// PASTE YOUR FULL DATABASE_URI STRING HERE DIRECTLY (Don't use process.env yet)
const connectionString = '';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false } // Required for Supabase usually
});

console.log('Attempting to connect...');

try {
  await client.connect();
  console.log('✅ SUCCESS: Connected to Supabase!');
  const res = await client.query('SELECT NOW()');
  console.log('Database Time:', res.rows[0]);
  await client.end();
} catch (err) {
  console.error('❌ ERROR: Connection failed');
  console.error(err);
}