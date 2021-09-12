const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/registro', async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password)
    const nuevoUsuario = new User({email,password});
    await nuevoUsuario.save();
    
    const token = jwt.sign({_id: nuevoUsuario._id}, 'secretKey')
    res.status(200).json({token})

})

router.post('/ingresar', async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({email})

    if (!user) return res.status(401).send("El correo no existe");
    if (user.password !== password) return res.status(401).send('Password incorrecta');

    const token = jwt.sign({_id: user._id}, 'secretKey');
    return res.status(200).json({token});
})

router.get('/', (req, res) => res.send('Hola!'))

module.exports = router;