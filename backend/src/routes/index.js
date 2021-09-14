const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/registrar', async (req, res) => {
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

router.get('/tareas', (re, res) => {
    res.json([
        {
            _id: 1,
            name: 'tarea 1',
            descripcion: 'lorem imsum',
            date: '2021-09-12T08:20:00.043+00:00'
        },
        {
            _id: 2,
            name: 'tarea 2',
            descripcion: 'lorem imsum',
            date: '2021-09-12T08:20:00.043+00:00'
        },
        {
            _id: 3,
            name: 'tarea 3',
            descripcion: 'lorem imsum',
            date: '2021-09-12T08:20:00.043+00:00'
        },
    ]);

    
});

router.get('/tareas-privadas', verifyToken, (re, res) => {
    res.json([
        {
            _id: 1,
            name: 'tarea 1',
            descripcion: 'lorem imsum',
            date: '2021-09-12T08:20:00.043+00:00'
        },
        {
            _id: 2,
            name: 'tarea 2',
            descripcion: 'lorem imsum',
            date: '2021-09-12T08:20:00.043+00:00'
        },
        {
            _id: 3,
            name: 'tarea 3',
            descripcion: 'lorem imsum',
            date: '2021-09-12T08:20:00.043+00:00'
        },
    ]);

    
});

router.get('/perfil', verifyToken, (req, res) => {
    res.send(req.userId);
})

router.get('/', (req, res) => res.send('Hola!'))

module.exports = router;

function verifyToken(req, res, next){
    if (!req.headers.authorization){
        return res.status(401).send('Solicitud no autorizada')
    }

    const token =req.headers.authorization.split(' ')[1];
    if (token === 'null'){
        return res.status(401).send('Solicitud no autorizada');
    }

    const payload = jwt.verify(token, 'secretKey');
    
    req.userId = payload._id;
    next();

}