/**
 * Un middleware pour initialiser la propriété user à false dans la session et rendre la propriété user disponible dans toutes les vues 
 * en l'ajoutant dans l'object locals attaché à la response
 */
/* const userMW = (request, response, next) => {
  if (!request.session.user) {
    request.session.user = false;
}
response.locals.user = request.session.user;

  next();
};

module.exports = userMW; */

//JWT !!


/**
 * Un middleware qui controle la présence d'un token dans le header et qui vérifi sa signature avec la methode verify de jsonwebtoken.
 */
//const jwt = require('jsonwebtoken');


/* const MWjwt = (req, res, next) => {

  console.log("req.headers =>", req.headers);
  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log("mon token dans MWjxt => ", token);
  if (!token) return res.status(401).json('Pas de token, pas de chocolat !');
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload;
    console.log("decodPayload =>", decodedPayload );
    next();
  } catch (error) {
    console.log("Invalid token");
    res.status(400).json('Invalid token.');
  }
}  */

//module.exports = MWjwt;

