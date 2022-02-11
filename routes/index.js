var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

router.post('/addtowishlist', async function (req, res, next){
  console.log("---addtowishlist route backend")
  console.log("---req.body =>", req.body)

  var user = await userModel.findOne({token : req.body.userToken});
  console.log("---user =>", user);

  var isAlreadyInDB = false;

  if(user){
    for (let i = 0; i < user.userArticles.length; i++){
        console.log("---#1req.body.titleFromFront", req.body.titleFromFront )
        console.log("---#2user.userArticles[i].title", user.userArticles[i].title)

      if(req.body.titleFromFront === user.userArticles[i].title){
        console.log("---#3 nous entrons dans le if de match")
        isAlreadyInDB = true
        console.log("---article already in DB")
      }
    }

    if(isAlreadyInDB === false){
      console.log("---is already in DB =>", isAlreadyInDB)
      
      user.userArticles.push(
        {
          title: req.body.titleFromFront,
          content: req.body.contentFromFront,
          urlToImage: req.body.urlToImageFromFront
        }
      );

      var userArticleSaved = await user.save();

        console.log("---userArticle Saved", userArticleSaved);
    }
  }
  
  console.log("---isalreadyinDB", isAlreadyInDB)

  var result = !isAlreadyInDB 

  res.json({result})
});

router.post('/deletewishlist', async function (req, res, next){
  console.log("---deletewishlist route backend")
  console.log("---req.body", req.body)

  var user = await userModel.findOne({token : req.body.userToken});
  console.log("---user =>", user);

  var isInDB = false;

  if(user){
    for (let i = 0; i < user.userArticles.length; i++){
      console.log("---#1req.body.titleFromFront =>", req.body.titleFromFront )
      console.log("---#2user.userArticles[i].title =>", user.userArticles[i].title)

      if(req.body.titleFromFront === user.userArticles[i].title){
        console.log("---#3 nous entrons dans le if de match")
        isInDB= true
        console.log("---#4", isInDB)
      }
    }

    if(isInDB === true){
      user.userArticles = user.userArticles.filter((article) => (article.title != req.body.titleFromFront))
    };

    var userArticleDeleted = await user.save();

    console.log("---userArticle Deleted", userArticleDeleted)
  }

  res.json({result: isInDB})

});

module.exports = router;
