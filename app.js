const express = require("express");
const session = require("express-session");

const app = express();

// Configuración de la sesión
app.use(session({
    secret: "mi-clave-secreta",
    resave: false,
    saveUninitialized: true, // Corrección en el nombre de la propiedad
    cookie: { secure: false }
}));

// Middleware para mostrar detalles de la sesión
app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.createdAt) {
            req.session.createdAt = new Date(); // Asignamos la fecha de creación de la sesión
        }
        req.session.lastAccess = new Date(); // Actualiza el último acceso
    }
    next();
});

// Ruta para mostrar la información de la sesión
app.get('/session', (req, res) => {
    if (req.session) {
        const sessionID = req.session.id;
        const createdAt = req.session.createdAt;
        const lastAccess = req.session.lastAccess;
        const sessionDuration = Math.floor((new Date() - new Date(createdAt)) / 1000); // Corrección de cálculo de duración
        

        res.send(`
            <h1>Detalles de la sesión</h1>
            <p><strong>ID de Sesión:</strong> ${sessionID}</p>
            <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
            <p><strong>Último acceso:</strong> ${lastAccess}</p>
            <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
        `);
    } else {
        res.send('<h1>No hay sesión activa aún.</h1>');
    }
});

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error al cerrar la sesión.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
