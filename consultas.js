const { Pool } = require('pg')
const bcrypt = require('bcrypt');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'ok',
    database: 'softjobs',
    allowExitOnIdle: true
})


const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    try{
        const { password: passwordEncriptada } = usuario
    }
    catch(error){
        //throw { code: 401, message: "Email o contraseña incorrecta" }
        throw { code: 401, message: "Email o contraseña incorrecta" }
    }
    
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}

const registrarUsuario = async (usuario) => {
    try{
        let { email, password, rol, lenguage } = usuario
        // 5. Encriptar las contraseñas al momento de registrar nuevos usuarios (3 puntos)
        const passwordEncriptada = bcrypt.hashSync(password, 10)
        //Aca falta primero buscar si hay alguien registrado con este email para evitar repeticiones
        const values = [email, passwordEncriptada, rol, lenguage]
        const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
        await pool.query(consulta, values)
    }
    catch(error){
        console.log(error)
    }
}

const leerRegistro = async (email) => {
    const values = [email]
    const consulta = "SELECT email,  rol, lenguage FROM usuarios WHERE email = $1"
    const {rows} = await pool.query(consulta, values)
  
    return(rows[0])
}


module.exports = {  verificarCredenciales, registrarUsuario, leerRegistro}