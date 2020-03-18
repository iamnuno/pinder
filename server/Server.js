var express = require('express');
var bodyParser = require('body-parser');
var dBHandler = require('./DBHandler');
var conn = require('./database');
var app = express();
var path = require("path");
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');
var _ = require('underscore');

app.use(bodyParser.json({
  type: 'application/json'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));


conn.connect(function(err) {
  if (err) console.log(err);
  else console.log('connected');
});

//get all dBHandler
app.get('/api/users', async (req, res) => {
  let userData = await dBHandler.getUsers();
  res.json(userData);
});

//get a specific user
app.get('/api/user/:id', async(req, res)=> {
  let json = {};
  _.extend(json, await dBHandler.getUser(req.params.id));

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
    pets[i]["picture"] =  petpic;
  }
  json["pets"] = pets;

  console.log(json);
  res.json(json);
});


//get all pets
app.get('/api/pets', async (req, res) => {
  res.json( await dBHandler.getAllPets());
});

//get all pets for a specific user
app.get('/api/pets/:id', async (req, res) => {
  res.json(await dBHandler.getPets(req.params.id));
});

// remove  pet rom database
app.delete('/api/removepet/:id', async (req, res) => {
  dBHandler.deletePet(req.params.id, function(err, data) {

    if (err) {
      console.log(err);
    }
    res.json("Item has be removed permanently!");
  });
});

// register a new pet for user
app.post('/api/newpet/:userID', async (req, res) => {
  dBHandler.addPet(req.body, function(err, result) {

    if (err) {
      return res.status(400).
      json("Registeration failed!");
    }
    res.json("Registered successfully!");
  })
});

// register a new user
app.post('/api/createUser', async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const birthday = req.body.birthday;

  dBHandler.emailExists(email, function(err, data) {

    if (err)
      console.log(err);

    if (data[0].cnt == 0) {
      dBHandler.addUser(firstName, lastName, email, password, birthday);
      res.json("Email Created");
    } else if (data[0].cnt == 1) {
      res.json("Account Exists");
    }
  });
});

//send an image
app.get('/api/file/:name', function(req, res, next) {
  var options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = req.params.name
  res.sendFile(fileName, options, function(err) {
    if (err)
      next(err)

    console.log('Sent:', fileName)
  })
});

app.get('/api/image/:userID/:petID', async(req, res)=> {
  res.json(await dBHandler.getImages(req.params.userID, req.params.petID));
});

app.post('/api/upload/:userID/:petID/:defaultpic', upload.single('image'), async function(req, res) {
  const imagePath = path.join(__dirname, '/public');
  const fileUpload = new Resize(imagePath);

  if (!req.file) {
    return res.status(401).json({
      error: 'Please provide an image'
    });
  }

  const filename = await fileUpload.save(req.file.buffer);

  dBHandler.addImage(req.params.userID, filename, req.params.defaultpic, req.params.petID,
    function(err, result) {

      if (err)
        return res.status(200).json({
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

//get likes for specific pet
app.get('/api/likes/:petId', async (req, res) => {
  res.json(await dBHandler.getLikePetId(req.params.petId));
});

//make a like
app.post('/api/likes', async (req, res) => {
  res.json(await dBHandler.makeLike(req.body));
});

app.listen(4412);
