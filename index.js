import express from 'express';
import db from './db.js';
import { validate as isUUID } from 'uuid';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  try {
    res.status(200);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).set('Internal Server Error');
  }
});

app.get('/todos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send('Name is required');
    }
    const result = await db.query(
      'INSERT INTO todos (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('ID is required');
    }
    if (!isUUID(id)) {
      return res.status(400).send('Invalid ID format. Expected a UUID.');
    }
    const result = await db.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Todo not found');
    }

    res.status(200).json({
      message: 'Todo deleted successfully',
      deletedTodo: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('ID is required');
    }
    if (!isUUID(id)) {
      return res.status(400).send('Invalid ID format. Expected a UUID.');
    }

    const { name, isDone } = req.body;
    console.log('name'.name);
    if (!name) {
      return res.status(400).send('Name is required');
    }

    const result = await db.query(
      'UPDATE todos SET name = $2, is_done = $3 WHERE id = $1 RETURNING *',
      [id, name, isDone]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Todo not found');
    }

    res.status(200).json({
      message: 'Todo updated successfully',
      updatedTodo: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
