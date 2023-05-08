const jwt = require('jsonwebtoken')

//2 a. Verificar la existencia de credenciales en la ruta que corresponda
function verificarExistenciaDeCredenciales(fields) {
  return function (req, res, next) {
    const missingFields = fields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Faltan campos: ${missingFields.join(', ')}` });
    }
    next();
  };
}

//2 b. Validar el token recibido en las cabeceras en la ruta que corresponda
const verificarToken = (req, res, next) => {
  const token = req.header("Authorization").split("Bearer ")[1]

  if (!token) throw {
    code: 401,
    message: "Debes incluir token en el header"
  }
  //3. Firmar, VERIFICAR y DECODIFICAR tokens JWT (3 puntos)
  const tokenValido = jwt.verify(token, 'clavesecreta')
  // otra opcion para decodificar
  // const {email} = jwt.decode(token)

  req.email = tokenValido.email
  next()
}

// 2 c. Reportar por la terminal las consultas recibidas en el servidor
const logEnElTerminal = (req, res, next) => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`${time} --- Recibe llamada de tipo ${req.method}, en la ruta ${req.path}`)
  next()
}

module.exports = { verificarExistenciaDeCredenciales, verificarToken, logEnElTerminal } 