const express = require("express");
const session = require("express-session");
const req = require("express/lib/request");
const res = require("express/lib/response");
const moment = require("moment-timezone");

const app = express();

// Configuración de la sesión
app.use(session({
    secret: "p3-AOD_P@$$W0rd25-sesionespersistentes",
    resave: false, //no resguardar la ssion si no ha sido modificada
    saveUninitialized: true, // Corrección en el nombre de la propiedad
    cookie: { secure: false, maxAge:24*60*60*1000 } //usar secure : true solo si usas HTTPS, maxAge: definir la duracion maxima de la sesion
}));

// Middleware para mostrar detalles de la sesión
app.get('/login/'),(req,res) => {
    if (!req.session.createdAt) {
        req.session.createdAt = new Date(); // Asignamos la fecha de creación de la sesión
        req.session.createdAt = new Date()
        res.send('La sesion ha sido iniciada');
        
    }else{
        res.send('Ya existe una sesion');
    }
};

// Ruta para mostrar la información de la sesión
app.get('/update', (req, res) => {
    if (req.session.createdAt) {
        req.session.lastAccess=new Date();
res.send('La fecha de ultimo acceso ha sido actualizada');
    }else{
        res.send('No hay una sesion activa');
    }
});

//ruta para obtener el estado de la sesion
app.get('/status', (req,res)=>{
    if  (req.session.createdAt){
        const now = new Date();
        const started = new Date (req.session.createdAt);
        const lastUpdate = new Date (req.session.lastAccess);

        //Calcular la antiguedad de la sesion
        const sesionAgeMs = now - started;
        const hours = Math.floor(sesionAgeMs/(1000*60*60));
        const minutes = Math.floor((sesionAgeMs % (1000 * 60 * 60))/(1000*60));
        const seconds =Math.floor((sesionAgeMs % (1000 * 60))/ 1000);

        //Convertir las fechas al uso horario CDMX
        const inicioCDMX = moment (inicio).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const ultimoAccesoCDMX = moment (ultimoAcceso).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');   
        
        res.json({
            inicioCDMX,
            ultimoAccesoCDMX,
            antiguedad: { horas: hours, minutos: minutes, segundos: seconds },
        });
    } else {
        res.status(404).json({ error: 'Sesión no encontrada.' });
    }
});


// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    if (req.session.createdAt){
        req.session.destroy((err)=>{
            if (err){
                return res.status(500).send('Error al cerra la sesion');
            }
            res.send('Sesiion cerrada correctamente.');
        });
    }else{
        res.send('No hay una sesion activa para cerrar.');
    }
});

// Iniciar el servidor en el puerto 3000
const port = 3000;
app.listen(port, ()=>{
    console.log(`servidor iniciando en http://localhost:${Port}`);
});
