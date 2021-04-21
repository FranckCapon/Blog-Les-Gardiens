const jsonwebtoken = require ('jsonwebtoken');

//pour une intro rapide au systme JWT en 2min sur you tube : https://www.youtube.com/watch?v=NPJms-kg2F8 commence minute 1.27

const JWT_SECRET = process.env.JWT_SECRET; // => doit être une string dans .env.back d'au moins 100 caractéres en min, maj et nombre !! IMPORTANT contre brute force !! 
//cette clé ne doit jamais fuiter !! équivalent au code la bombe atomique pour nous :)

module.exports = {

  generateTokenForUser: function(userData) {
    // ici user Data contient toute les infos de mon user : id, firstname, password, email...
    console.log('userData dans JWT => ', userData)
    return jsonwebtoken.sign({
      //Ici on ne met jamais d'infos confidentiel dans le token !!  Car celui-ci peut facilement être décodé !
      pseudo: userData.pseuso,
      role:userData.group_name
      
    }, 
// je donne les codes de ma clé secréte
    JWT_SECRET,
// je défini la validité de mon token a 1h aprés ce token n'est plus valable.
    {
      expiresIn:'1h'
    }
    
    )
  }
}

/* 
 On peut décoder le token mais par contre il ne peut pas être resigné et faire des injection/ C'est là qu'est la sécurité !
Et je signe avec une constante que je définis, avec un max de caractéres pour blinder le chiffrement et empecher un décryptage par brute force  
*/

/* Pour les curieux => https://jwt.io/  n'importe qui peux décoder le TOKEN en 1 clic ! 

 */


//L'api va générer ce genre d'envoi :
/* {
  "pseudo": "Ton",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiTWVtYnJlIiwiaWF0IjoxNjE1MTYwMDE5LCJleHAiOjE2MTUxNjM2MTl9.oX3beQgKaLfiDhx0nm6mySzgbYw_DKVC7CQzAq0FRlY"
}
 */

//et le token comprend lui même 3 parties disctinctes : 
//un en tête : algo de chiffrement, type de token
//des données : payload (données + champs réservés {date expiration ...})
//et la signature: signature du token pour savoir si il est valide ou non, si falsifié, siganture plus valide !


