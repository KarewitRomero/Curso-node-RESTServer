const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { body } = require("express-validator");
const { generarJWT } = require("../helpers/generar-jwt");


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar que el correo existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            })
        }
        //Si el usuario esta activo en la base de datos
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado: false'
            })
        }
        //Verificar constraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - password'
            })
        }
        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Login ok',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Algo salio mal, contacte al administrador'
        })
    }
}

module.exports = {
    login
}

