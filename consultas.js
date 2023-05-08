const { Pool } = require('pg')
const bcrypt = require('bcrypt');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'ok',
    database: 'softjobs',
    allowExitOnIdle: true
})

const verificarEmail= async (email) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario] } = await pool.query(consulta, values)

    if (usuario === undefined || usuario === '')
        return false
    else
        return true


}

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario
    if (email, password, rol, lenguage) {

        // 5. Encriptar las contraseñas al momento de registrar nuevos usuarios (3 puntos)
        const passwordEncriptada = bcrypt.hashSync(password, 10)
        const values = [email, passwordEncriptada, rol, lenguage]
        const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
        await pool.query(consulta, values)
    }
}



const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (usuario === undefined || usuario === '')
        throw { code: 401, message: "Usuario no encontrado" }

    const { password: passwordEncriptada } = usuario

    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Contraseña incorrecta" }
}



const leerRegistro = async (email) => {
    const values = [email]
    const consulta = "SELECT email,  rol, lenguage FROM usuarios WHERE email = $1"
    const { rows } = await pool.query(consulta, values)
    return (rows[0])
}

module.exports = {verificarEmail,  registrarUsuario, verificarCredenciales, leerRegistro}