const express = require("express");
const session = require("express-session");
const moment = require("moment-timezone");

const app = express();

// Configuración de la sesión
app.use(session({
    secret: "p3-AOD_P@$$W0rd25-sesionespersistentes",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Middleware para iniciar sesión
app.get('/login', (req, res) => {
    if (!req.session.createdAt) {
        req.session.createdAt = new Date();
        res.send('La sesión ha sido iniciada');
    } else {
        res.send('Ya existe una sesión');
    }
});

// Ruta para actualizar el último acceso
app.get('/update', (req, res) => {
    if (req.session.createdAt) {
        req.session.lastAccess = new Date();
        res.send('La fecha de último acceso ha sido actualizada');
    } else {
        res.send('No hay una sesión activa');
    }
});

// Ruta para obtener el estado de la sesión
app.get('/status', (req, res) => {
    if (req.session.createdAt) {
        const now = new Date();
        const started = new Date(req.session.createdAt);
        const lastUpdate = new Date(req.session.lastAccess || started);

        // Calcular la antigüedad de la sesión
        const sessionAgeMs = now - started;
        const hours = Math.floor(sessionAgeMs / (1000 * 60 * 60));
        const minutes = Math.floor((sessionAgeMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((sessionAgeMs % (1000 * 60)) / 1000);

        // Convertir las fechas al uso horario CDMX
        const inicioCDMX = moment(started).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const ultimoAccesoCDMX = moment(lastUpdate).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

        res.json({
            inicioCDMX,
            ultimoAccesoCDMX,
            antigüedad: { horas: hours, minutos: minutes, segundos: seconds }
        });
    } else {
        res.status(404).json({ error: 'Sesión no encontrada.' });
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    if (req.session.createdAt) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error al cerrar la sesión');
            }
            res.send('Sesión cerrada correctamente.');
        });
    } else {
        res.send('No hay una sesión activa para cerrar.');
    }
});

// Iniciar el servidor en el puerto 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciando en el puerto:${port}`);
});
