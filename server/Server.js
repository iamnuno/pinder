require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var dBHandler = require('./DBHandler');
var conn = require('./database');
var app = express();
var path = require("path");
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');
var _ = require('underscore');
var moment = require('moment');

const jwt = require('jsonwebtoken');

var app = express();

var userData;

//To have an access to public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json({
  type: 'application/json'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  var token = req.headers['authorization'];

  if (!token) return next();

  token = token.replace('Bearer ', '');

  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user;
      next();
    }
  });
});

conn.connect(function (err) {
  if (err) console.log(err);
  else console.log('connected');
});

//Verify the user's authentication
app.get('/api/verifyToken', function (req, res) {
  var token = req.body.token || req.query.token;

  if (!token) {
    return res.status(400).json({
      error: true,
      message: "token is required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });

    if (user.id !== userData.id) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    }

    return res.json({ userData: userData, token });
  });
});

//log-in authentication
app.post('/api/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  dBHandler.logedIn(email, password, async (err, data)=> {
    if (err) {
      console.log(err);
    }

    if (data[0].cnt > 0) {
      userData = await dBHandler.getUserByEmail(email);
      var token = dBHandler.generateToken(userData);
      res.json({ message: "Log In Successfully", status: true, Data: userData, Token: token });
    }
    else {
      res.json({ message: "Check your email and password", status: false, Data: userData });

    }

  });
});

//To check if the user has the previliage to access home page
app.get('/home', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome ' + req.user.name);
});

//To send contact us page 
app.get('/contact_us', function (req, res) {

  res.sendFile(path.resolve(__dirname, "public", "contactUs.html"));
});

//To send about page
app.get('/about', function (req, res) {

  res.sendFile(path.resolve(__dirname, "public", "About.html"));
});

//get all users
app.get('/api/users', async (req, res) => {
  let userData = await dBHandler.getUsers();
  res.json(userData);
});

//get full information for a specific user
app.get('/api/user/:id', async (req, res) => {
  let json = {};
  _.extend(json, await dBHandler.getUser(req.params.id));
  json["0"]["birthday"] = moment(json["0"]["birthday"]).format('YYYY-MM-DD');
  json["picture"] = {};
  let userPic = [];
  (await dBHandler.getImages(req.params.id, 0)).forEach((item, i) => {
    userPic.push(item.url);
  });

  json.picture = userPic;

  let pets = await dBHandler.getPets(req.params.id);

  for (var i = 0; i < pets.length; i++) {
    var petpic = [];
    (await dBHandler.getImages(req.params.id, pets[i].id)).forEach((item, i) => {
      petpic.push(item.url);
    });
    pets[i]["birthday"] = moment(pets[i]["birthday"]).format('YYYY-MM-DD');
    pets[i]["picture"] = petpic;
  }
  json["pets"] = pets;
  return res.json(json);
});

// register a new user
app.post('/api/createUser', async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const birth = req.body.birthday;

  const birthday = moment(birth).format('YYYY-MM-DD');

  if (password === confirmPassword) {
    dBHandler.emailExists(email, async (err, data) =>{
      if (err) console.log(err);

      if (data[0].cnt > 0) {
        res.json({
          message: "Email Exists",
          status: false,
          Data: null,
          Token: null
        });
      } else {
        dBHandler.addUser(firstName, lastName, email, password, birthday);
        userData = await dBHandler.getUserByEmail(email);
        var token = dBHandler.generateToken(userData);
        res.json({
          message: "Account Created",
          status: true,
          Data: userData,
          Token: token
        });
      }
    });
  } else {
    res.json({
      message: "Password and Confirm Password doesn't match",
      status: false,
      Data: null,
      Token: null
    });
  }
});

//returns comments/username/nmb of likes
app.get('/api/comments/:id', async (req, res) => {
  let comments = {};
  comments = {
    comments: (await dBHandler.getComments(req.params.id))
  };

  if (comments.comments.length == 0)
    return res.status(400).json({
      error: "this id is either has no comments or does not exist"
    });

  let likes = 0;
  comments.comments.forEach((item, i) => {
    if (item.likes == "1")
      likes++;

    delete item.likes;
  });
  var tmp = [likes];
  _.extend(comments, {
    likes: likes
  });
  return res.json(comments);
});

app.put('/api/updateuser', async (req, res) => {
  console.log(req.body);
  let response = await dBHandler.updateUser(req.body);
  res.json(response);
})

app.put('/api/updatepet', async (req, res) => {

  let response = await dBHandler.updatePet(req.body);
  res.json(response);
})

//get all pets
app.get('/api/pets/:id', async (req, res) => {
  res.json(await dBHandler.getPets(req.params.id));
});

//get all pets
app.get('/api/pets', async (req, res) => {
  res.json(await dBHandler.getAllPets());
});

// remove pet from database
app.delete('/api/removepet/:id', async (req, res) => {
  dBHandler.deletePet(req.params.id, function (err, data) {

    if (err) {
      console.log(err);
    }
    res.json("Item has be removed permanently!");
  });
});

// register a new pet for user
app.post('/api/newpet', async (req, res) => {
  let id = await dBHandler.maxId();

  res.json(response);
});

//send an image
app.get('/api/file/:name', function (req, res, next) {
  var options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  var fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err)
      next(err)

    console.log('Sent:', fileName)
  })
});
//retrieve images uri for user or pet
app.get('/api/image/:userID/:petID', async (req, res) => {
  res.json(await dBHandler.getImages(req.params.userID, req.params.petID));
});

//add an image to for a user or pet
app.post('/api/upload/:userID/:petID/:defaultpic', upload.single('image'), async function (req, res) {
  const imagePath = path.join(__dirname, '/public');
  const fileUpload = new Resize(imagePath);

  if (!req.file) {
    return res.status(400).json({
      error: 'Please provide an image'
    });
  }

  const filename = await fileUpload.save(req.file.buffer);

  dBHandler.addImage(req.params.userID, filename, req.params.defaultpic, req.params.petID,
    function (err, result) {

      if (err)
        return res.status(200)
          .json({
            error: "Failed to save imagePath in database!"
          });

      res.status(200).json({
        name: filename
      });
    })
});


//get all pets' images
app.get('/api/images', async (req, res) => {
  res.json(await dBHandler.getAllPetsImages());
});

//get all likes
app.get('/api/likes', async (req, res) => {
  res.json(await dBHandler.getAllLikes());

});


app.get('/api/likes/:petId', async (req, res) => {
  res.json(await dBHandler.getLikePetId(req.params.petId));
});

//make a like
app.post('/api/likes', async (req, res) => {
  res.json(await dBHandler.makeLike(req.body));
});

//To send Page not found
app.get('/**', function (req, res) {
  res.sendFile(path.resolve(__dirname, "public", "page404.html"));
});


app.listen(4412);
