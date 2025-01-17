const express = require("express");
const session = require("express-session");
const moment = require("moment-timezone");

const app = express();

// Configuración de la sesión
app.use(session({
    secret: "p3-AOD_P@$$W0rd25-sesionespersistentes",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware para iniciar sesión
app.get('/login', (req, res) => {
    if (!req.session.createdAt) {
        req.session.createdAt = new Date();
        res.send('La sesión ha sido iniciada');
    } else {
        res.send('Ya existe una sesión activa.');
    }
});

// Ruta para actualizar el último acceso
app.get('/update', (req, res) => {
    if (req.session.createdAt) {
        req.session.lastAccess = new Date();
        res.send('La fecha de último acceso ha sido actualizada');
    } else {
        res.send('No hay una sesión activa.');
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



app.get('/session/:username?', (req, res) => {
    if (!req.session.createdAt) {
        return res.status(404).send("<h1>No hay una sesión activa.</h1>");
    }

    const sessionId = req.session.id;
    const createdAt = req.session.createdAt;
    const lastAccess = req.session.lastAccess || "No disponible";
    const sessionDuration = Math.floor((new Date() - new Date(req.session.createdAt)) / 1000); 

    const username = req.params.username || "Usuario desconocido";

    res.send(`
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style=" color:rgb(0, 0, 0);">Detalles de la sesión</h1>
            <div style="border: 2px solidrgb(35, 36, 37); padding: 20px; border-radius: 8px; background-color: #EFEFEF;">
                <p><strong class="session-detail">Usuario:</strong> ${username}</p>
                <p><strong class="session-detail">ID de sesión:</strong> ${sessionId}</p>
                <p><strong class="session-detail">Fecha de creación de la sesión:</strong> ${createdAt}</p>
                <p><strong class="session-detail">Último acceso:</strong> ${lastAccess}</p>
                <p><strong class="session-detail">Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
            </div>
        </div>
       
    `);
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
    console.log(`Servidor iniciado en el puerto: ${port}`);
});


