const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el navegador (Frontend)
app.use(express.json()); // Permite recibir JSON en peticiones POST

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log(' Conectado exitosamente a MySQL Workbench');
});

// Ruta GET: Obtener todos los productos
app.get('/api/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(results);
  });
});

// Ruta POST: Guardar nuevo producto desde el panel de administración
app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria, imagen, descripcion } = req.body;
  const sql = 'INSERT INTO productos (nombre, precio, categoria, imagen, descripcion) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [nombre, precio, categoria, imagen, descripcion], (err, result) => {
    if (err) {
      console.error("Error insertando producto:", err);
      return res.status(500).json({ error: 'Error al guardar el producto' });
    }
    res.status(201).json({ message: 'Producto guardado con éxito', id: result.insertId });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));


