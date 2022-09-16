const express = require('express');
const cors = require('cors');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //Llamar las rutas de mi aplicación
        this.routes();
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