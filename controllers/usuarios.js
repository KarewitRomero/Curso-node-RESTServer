const { response, request, query } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');



const usuariosGet = async(req = request, res = response) => {

    // const { q, nombre = 'No name', apikey} = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find( query )
    //     .skip( Number( desde ) )
    //     .limit( Number( limite ) );

    // const total = await Usuario.countDocuments( query );

    // const resp = await Promise.all([
    //     Usuario.countDocuments( query ),
    //     Usuario.find( query )
    //         .skip( Number( desde ) )
    //         .limit( Number( limite ) )
    // ]);

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        // resp
        total,
        usuarios
    });

};

const usuariosPost = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    //Verificación si el correo existe
    // const existeEmail = await Usuario.findOne({ correo });
    // if( existeEmail ){
    //     return res.status(400).json({
    //         msg: 'El correo ya está registrado'
    //     })
    // }

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en
    await usuario.save();
    res.json({
        msg: 'post API - controlador',
        usuario
    });
};

const usuariosPut = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar contra base de datos
    if ( password ) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
};

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
};

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    const uid = req.uid;

    // Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );
    // res.json( usuario );

    //Cambiar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    //Usuario autentificado para hacer la eliminación
    const usuarioAutentificado = req.usuario;

    res.json({
        msg: 'delete API - controlador',
        usuario,
        usuarioAutentificado,
        uid
    });
};




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};