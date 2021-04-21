// je require les info de connexion qui sont dans un point env précis en passant en argument la localisation du .env.back 
require('dotenv').config({ path: `${__dirname}/.env.back` });

// on require les modules nécéssaire : 
const cors = require('cors');
//const corsMW = require('./app/middlewares/corsMW');
const log = require('./app/middlewares/log');
const expressSanitizer = require('express-sanitizer');
const express = require('express');
const session = require('express-session');
const router = require('./app/router');

const app = express();

//on utilise la variable d'environnement PORT pour attribuer un port à notre appli express ou port par défault
const port = process.env.PORT || 5000;

// Mise en place de swagger pour plus tard quand on voudra documenter notre API => https://www.npmjs.com/package/express-swagger-generator 
//-----------------------------------------------------------------------------------
const expressSwagger = require('express-swagger-generator')(app);
let options = require('./swagger-config.json');
options.basedir = __dirname; // __dirname désigne le dossier du point d'entrée
options.swaggerDefinition.host = `localhost:${port}`;
expressSwagger(options);
//FIN DE LA CONFIGURATION DE SWAGGER-----------------------------------------------------------



//configuration pour utiliser EJS comme moteur de templates //
//----------------------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', 'app/views');
//FIN DE LA CONFIGURATION EJS------------------------------------------------------------------



//Nos Middlewares :
//-----------------------------------------------------------------------------------

// module de log d'identification : me donne l'ip, l'heure et l'url de chaque connexion  
app.use(log);

// le parser JSON qui récupère le payload quand il y en a un et le transforme en objet JS disponible sous request.body
app.use(express.json()); 

// on va devoir gérer des données en POST, on ajoute le middleware urlencoded pour récupérer les infos dans request.body 
app.use(express.urlencoded({extended: true})); 

//Une ptite sécurité supplémentaire avec ce module qui filtre, comme Joi, nos entrés, en enlevant tout tag html et balise notamment
app.use(expressSanitizer()); 

//on ajoute les ressources statiques du projet si besoin
//app.use(express.static(`${__dirname}/app/mon_fichier_static_si_besoin`)));
console.log('je suis avant session/cors dans index.js')
//mise en place du système de sessions pour stocker les infos utilisateur // https://www.npmjs.com/package/express-session
app.use(
  session({
    resave: true, // Resauver la session à chaque requête -> pour prolonger la durée de vie
    saveUninitialized: true, // Permet de sauver automatiquement la session d'un visiteur sans que j'ai à l'intialiser moi-même
    secret: process.env.SECRET, // le .env est dans la variable SECRET du .env.back
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 5, // ça fait une heure * 5
    },
  })
);

// Je require le middleware pour dire à express d'être plus permissif sur l'origine des requête

app.use(cors({
  optionsSuccessStatus: 200,
  credentials: true,
  origin: true,
  methods: "GET, PUT, PATCH, POST, DELETE",
  allowedHeaders : ['Content-Type', 'Authorization'],
})); 
 
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept")
  response.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  next();
});



// petit middleware pour tester si un utilisateur est connecté : si c'est le cas, on le rajoute dans res.locals et on pourra utiliser la variable "user" dans toutes les views
//app.use(userMW); 


//FIN DES MIDDLEWARES----------------------------------------------------------------------


// on préfixe notre router avec un V1 qui sera inclus devant chaque nom de route. Permet de faire évoluer l'app avec une V2 plus facilement.
app.use('/v1', router);



app.listen(port, () => {
  console.log(`API Back jeux de société Running on http://localhost:${port}`);
});
