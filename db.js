import pkg from 'pg';

const pool = new pkg.Pool({
  user: 'postgres',
  password: 'password123++',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
});

export default {
  query: (text, params) => pool.query(text, params),
};
