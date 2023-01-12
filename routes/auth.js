const { Router } = require('express');
//Para hacer las validaciones
const { check } = require('express-validator');
//Hacer la validacion del campo
const { validarCampos } = require('../middlewares/validar-campos');

const { login } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

module.exports = router;