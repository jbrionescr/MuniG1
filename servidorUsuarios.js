const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 1212;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read DB
const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

// Helper function to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// GET: Ver todos los reportes
app.get('/reportes', (req, res) => {
    try {
        const db = readDB();
        res.json(db.reportes || []);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los reportes' });
    }
});

// GET por ID: Ver detalle de un reporte
app.get('/reportes/:id', (req, res) => {
    try {
        const db = readDB();
        const reporte = db.reportes.find(r => r.id === req.params.id);
        if (reporte) {
            res.json(reporte);
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el reporte' });
    }
});

// PUT: Actualizar estado (Pendiente, En Proceso, Resuelto)
app.put('/reportes/:id', (req, res) => {
    try {
        const db = readDB();
        const index = db.reportes.findIndex(r => r.id === req.params.id);
        if (index !== -1) {
            db.reportes[index] = { ...db.reportes[index], ...req.body };
            writeDB(db);
            res.json(db.reportes[index]);
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el reporte' });
    }
});

// DELETE: Eliminar reportes invalidos
app.delete('/reportes/:id', (req, res) => {
    try {
        const db = readDB();
        const originalLength = db.reportes.length;
        db.reportes = db.reportes.filter(r => r.id !== req.params.id);

        if (db.reportes.length < originalLength) {
            writeDB(db);
            res.json({ message: 'Reporte eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el reporte' });
    }
});

// Endpoints para usuarios (necesarios para el funcionamiento actual)
app.get('/usuarios', (req, res) => {
    const db = readDB();
    res.json(db.usuarios || []);
});

app.post('/usuarios', (req, res) => {
    const db = readDB();
    const newUser = { id: Date.now().toString(16), ...req.body };
    db.usuarios.push(newUser);
    writeDB(db);
    res.json(newUser);
});

app.listen(PORT, () => {
    console.log(`Servidor de Usuarios y Reportes corriendo en http://localhost:${PORT}`);
});
