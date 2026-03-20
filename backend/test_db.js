const { Client } = require('pg');

const connectionString = "postgresql://postgres.qubdhsbxwnwicxvexeyl:MDP%40Supabase_26@44.208.221.186:6543/postgres?sslmode=require";

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected successfully');
    return client.query('SELECT 1');
  })
  .then(res => {
    console.log('Query result:', res.rows);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
    process.exit(1);
  });
