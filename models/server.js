const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        //Variables de entorno
        this.port = process.env.PORT;
        //Rutas
        this.usuariosPath = '/api/usuarios';
        //Ruta de autentificación
        this.authPath = '/api/auth';

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Llamar las rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    //Métodos para todos los middleware
    middlewares(){

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body por el método post/put/delete
        this.app.use( express.json() );

        //Directorio público
        this.app.use( express.static('public') );
    }

    //Método para configurar las rutas
    routes() {
        //Ruta de autentificación
        this.app.use(this.authPath, require('../routes/auth'));
        
        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    //Método para escuchar el puerto
    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        } );
    }


}


module.exports = Server;