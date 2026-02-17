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

// POST: Crear nuevo reporte
app.post('/reportes', (req, res) => {
    try {
        const db = readDB();
        const newReport = {
            id: Date.now().toString(16),
            fecha: new Date().toISOString(),
            estado: 'Pendiente',
            ...req.body
        };
        db.reportes = db.reportes || [];
        db.reportes.push(newReport);
        writeDB(db);
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el reporte' });
    }
});

// --- ENDPOINTS PROYECTOS VIALES ---

// GET: Ver todos los proyectos
app.get('/proyectos', (req, res) => {
    try {
        const db = readDB();
        res.json(db.proyectos || []);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
});

// POST: Crear proyecto
app.post('/proyectos', (req, res) => {
    try {
        const db = readDB();
        const newProject = {
            id: Date.now().toString(16),
            ...req.body
        };
        db.proyectos = db.proyectos || [];
        db.proyectos.push(newProject);
        writeDB(db);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear proyecto' });
    }
});

// PUT: Actualizar proyecto
app.put('/proyectos/:id', (req, res) => {
    try {
        const db = readDB();
        const index = db.proyectos.findIndex(p => p.id === req.params.id);
        if (index !== -1) {
            db.proyectos[index] = { ...db.proyectos[index], ...req.body };
            writeDB(db);
            res.json(db.proyectos[index]);
        } else {
            res.status(404).json({ error: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar proyecto' });
    }
});

// DELETE: Eliminar proyecto
app.delete('/proyectos/:id', (req, res) => {
    try {
        const db = readDB();
        db.proyectos = db.proyectos.filter(p => p.id !== req.params.id);
        writeDB(db);
        res.json({ message: 'Proyecto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar proyecto' });
    }
});

// --- ENDPOINTS SERVICIOS PÚBLICOS ---

// GET: Ver todos los servicios
app.get('/servicios', (req, res) => {
    try {
        const db = readDB();
        res.json(db.servicios || []);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// POST: Crear servicio
app.post('/servicios', (req, res) => {
    try {
        const db = readDB();
        const newService = {
            id: Date.now().toString(16),
            ...req.body
        };
        db.servicios = db.servicios || [];
        db.servicios.push(newService);
        writeDB(db);
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear servicio' });
    }
});

// PUT: Actualizar servicio
app.put('/servicios/:id', (req, res) => {
    try {
        const db = readDB();
        const index = db.servicios.findIndex(s => s.id === req.params.id);
        if (index !== -1) {
            db.servicios[index] = { ...db.servicios[index], ...req.body };
            writeDB(db);
            res.json(db.servicios[index]);
        } else {
            res.status(404).json({ error: 'Servicio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar servicio' });
    }
});

// DELETE: Eliminar servicio
app.delete('/servicios/:id', (req, res) => {
    try {
        const db = readDB();
        db.servicios = db.servicios.filter(s => s.id !== req.params.id);
        writeDB(db);
        res.json({ message: 'Servicio eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar servicio' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Usuarios y Reportes corriendo en http://localhost:${PORT}`);
});
