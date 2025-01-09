const express = require ("express")
const expressSesions = require("express-session");
const req = require("express/lib/request");

const app = express()
//configuracion de la sesion 
app.use(sesio({
    secret:"mi-clave-secreta",
    resave:false,
    saveUnitialized:true,
    cookie:{secure:false}
}));

//midleware para mostrar detalles de la sesion 
app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.createdAt) {
            req.session.createdAt = new Date(); // Asignamos la fecha de creación de la sesión
        }
    }
    next();
});

//ruta para mostrar la informacion de la sesion 
app.get('/session',(req,res)=>{
    if (req.session){
        const sessionID= req.session.id;
        const createdAt= req.session.createdAt;
        const lastAccess=req.session.lastAccess;
        const sessionDuration=(new Date()= createdAt)/1000;
        res.send(`
            <h1>Detalles de la sesion </h1>
            <p><strong>ID de Sesion </strong>${sessionID}</p>
            <p><strong> Fecha de la creacion de la sesion: </strong>${createdAt}</p>
            <p><strong> Ultimo acceso: </strong>${lastAccess}</p>
            <p><strong> Duraciòn de la sesiòn (en segundos):  </strong>${sessionDuration}</p>
            `
        )
    }else{
        res.send('</h1>No hay sesiòn activa aun.</h1>')
    }
});

//Ruta paar cerrar la seion 
app.get('/logout', (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.send('Error al cerrar la sesiòn.');
        }
        res.send('</h1>Sesiòn cerrada exitosamente.</h1>');
    });
});

//Iniciar el servidor en el puerto 3000
app.listen(3000, ()=>{
    console.log('Servidor corriendo en el puerto 3000');
});