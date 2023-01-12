const { response, request } = require('express');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token');
    //Verificar que lleve un token
    if(! token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );
        //Validar que el usuario exista
        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existente'
            });
        }
        //Validar que el usuario no se encuentre en estado false
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado false'
            });
        }
        //Usuario correspondiente
        req.usuario = usuario;
        //Mandar el uid
        // req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
};

module.exports = {
    validarJWT
}