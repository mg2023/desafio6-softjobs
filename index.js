const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const { verificarExistenciaDeCredenciales, verificarToken, logEnElTerminal } = require('./middleware')
const { verificarCredenciales, registrarUsuario, leerRegistro } = require('./consultas')

const cors = require('cors')

app.listen(3000, console.log('Servidor OK'))
app.use(cors())
app.use(express.json())

// 1. Registrar y obtener usuarios de la base de datos (1.5 puntos)
app.post('/usuarios', logEnElTerminal, async (req, res) => {
    try {
        console.log("Llega el req para registar al usuario")
        const usuario = req.body
        registrarUsuario(usuario)
        console.log('Usuario creado')
        res.send("Usuario creado con éxito")
    }
    catch {
        res.status(500).send(error)
    }
})


app.post('/login', logEnElTerminal, verificarExistenciaDeCredenciales, async (req, res) => {
    //Esta ruta debe recibir el email y password
    //Verificar que email y password existan en la base de datos email y password encriptado
    //si todo va bien, debe crear un token a partir del email
    //Retornar el token
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        // 3. Firmar, verificar y decodificar tokens JWT (3 puntos)
        const token = jwt.sign({ email }, 'clavesecreta', { expiresIn: "2 days" })
        console.log('Usuario logueado')
        res.send(token)
    }
    catch (error) {
        console.log(error)
        //res.status(error.code || 500).send(error)
        res.status(error.code || 500).send(error.message)
    }
})



//Esta es una vista que requiere que el usario se encuentre loggeado 
//y con su respectivo token
app.get('/usuarios', logEnElTerminal, verificarToken, async (req, res) => {
    try {
        // //Luego que el usuario esta loggeado, 
        // //Puede navegar en la plataforma enviando el token en el header
        // //Se extrae el token del campo Authorization

        // // ○ Extraiga un token disponible en la propiedad Authorization de las cabeceras
        //const token = req.token

        // // ○ Verifique la validez del token usando la misma llave secreta usada en su firma
        // const tokenValido = jwt.verify(req.token,'clavesecreta' )
        // console.log('tokenValido:')
        // console.log(tokenValido)
        // console.log('FIn tokenValido')
        // // ○ Decodifique el token para obtener el email del usuario a buscar en su payload
        //const {email} = jwt.decode(req.token)

        // 5. Encriptar las contraseñas al momento de registrar nuevos usuarios (3 puntos)
        const result = await leerRegistro(req.email)
        console.log('Registro de usuario leido')

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
        //res.status(error.code || 500).send(error)
        res.status(error.code || 500).send(error.message)
    }
})