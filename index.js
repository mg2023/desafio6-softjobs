const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const { verificarExistenciaDeCredenciales, verificarToken, logEnElTerminal } = require('./middleware')
const { verificarEmail, registrarUsuario, verificarCredenciales, leerRegistro } = require('./consultas')

const cors = require('cors')

const now = new Date();
const time = now.toLocaleTimeString();
app.listen(3000, console.log(`${time} --- Servidor OK`))
app.use(cors())
app.use(express.json())

const requiredFields = ['email', 'password', 'rol', 'lenguage'];

// 1. REGISTRAR y obtener usuarios de la base de datos (1.5 puntos)
app.post('/usuarios', logEnElTerminal, verificarExistenciaDeCredenciales(requiredFields), async (req, res) => {
    try {
        const usuario = req.body  
        const status = await verificarEmail(usuario.email)    
        if (status === true){
            throw { code: 401, message: "Usuario ya existe" }
        }

        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    }
    catch(error) {
        //Se envia el mensaje de error aunque el front no lo considere, pero seria bueno que lo hiciera.
        res.status(error.code || 500).send(error.message)
    }
})

app.post('/login', logEnElTerminal, async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        // 3. FIRMAR, verificar y decodificar tokens JWT (3 puntos)
        const token = jwt.sign({ email }, 'clavesecreta', { expiresIn: "2 days" })
        res.send(token)
    }
    catch (error) {
        // 4. Capturar y devolver los posibles errores que ocurran en el servidor (0.5 puntos)
        //Envia los casos de usuario o contraseña incorrecta
        res.status(error.code || 500).send(error.message)
    }
})



//Esta es una vista que requiere que el usario se encuentre loggeado 
//y con su respectivo token
app.get('/usuarios', logEnElTerminal, verificarToken, async (req, res) => {
    try {

        // 1. Registar y OBTENER usuarios de la base de datos (1.5 puntos)
        const result = await leerRegistro(req.email)

        res.json({ 'email': req.email, 'rol': result.rol, 'lenguage': result.lenguage })
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('Invalid token');
        } else if (error.name === 'TokenExpiredError') {
            console.error('Token expired');
        } else {
            console.error('Unknown error', error);
        }
        res.status(error.code || 500).send(error.message)
    }
})