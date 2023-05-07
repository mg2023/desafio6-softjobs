const jwt = require('jsonwebtoken')


//2 a. Validar el token recibido en las cabeceras en la ruta que corresponda
// const verificarExistenciaDeCredenciales = (req,res,next) => {
    
//     console.log(req.body.email)
//     console.log(req.body.password)
    
//     if(req.body.email == '') throw {
        
//         code: 401,
//         message: "Debes incluir token en el email"
//     }
//     if(req.body.password === '') throw {
        
//         code: 401,
//         message: "Debes incluir token en el password"
//     }

 
//     next()
// }

function verificarExistenciaDeCredenciales(req, res, next) {
    const fields = Object.keys(req.body);
    const emptyFields = fields.filter(field => {
      return req.body[field] === undefined || req.body[field] === '';
    });
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: `Empty fields: ${emptyFields.join(', ')}` });
    }
    next();
  }



//2 b. Validar el token recibido en las cabeceras en la ruta que corresponda
const verificarToken = (req,res,next) => {
    console.log('P1')
    const token = req.header("Authorization").split("Bearer ")[1]

    if(!token) throw {
        code: 401,
        message: "Debes incluir token en el header"
    }

    const tokenValido = jwt.verify(token,'clavesecreta' )
    console.log(tokenValido.email)

    req.email = tokenValido.email
    next()
}




// 2 c. Reportar por la terminal las consultas recibidas en el servidor
const logEnElTerminal = (req,res,next) => {
    console.log('Recibe llamada de tipo %s, el la ruta %s', req.method, req.path)
    next()
}

module.exports = {  verificarExistenciaDeCredenciales, verificarToken, logEnElTerminal } 