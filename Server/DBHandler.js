var connection = require('./database');

const getUsers = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

function addUser(firstName, lastName, email, password, birthday) {
  connection.query(
    'INSERT INTO users SET firstName = ?, lastName = ?, email = ?, password =?, birthday=?', [firstName, lastName, email, password, birthday],
    function(err, result) {
      if (err) {
        return err;
      }
      return result;
    });
}
//delete a pet from db
function deletePet(petID, callback){//picture
  connection.query(
    'DELETE from pets WHERE id = ?', [petID], callback);
}
// add a pet to db
function addPet(json, callback){//picture
  console.log(json);
  connection.query(
    'INSERT INTO pets SET name = ?, birthday = ?, gender = ?, description = ?, type = ?, users_id = ?'
  , [json.name, json.birthday, json.gender, json.desc, json.type, json.users_id]
  , callback);
}

function emailExists(email, callback) {
  connection.query('SELECT count(*) AS cnt FROM users WHERE email = ? ', [email], callback);
}

const getUser = async (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE id = ? ', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

const getPets = async (id) => {
  return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM pets WHERE users_id = ?',[id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

const getAllPets = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM pets', (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

function addImage(userID, fileName, defaultpic = 0, petID = 0, callback){
  connection.query('INSERT INTO photos SET url = ?, defaultpic = ?, pets_id = ?, users_id = ?'
  ,[fileName, defaultpic, (petID == 0)? null : petID, userID]
  , callback);
}

const getImages = async (userID, petID) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT url from photos WHERE users_id = ?  AND pets_id ${(petID == 0)? "IS":"="} ?`,
    [userID, (petID == 0)? null : petID], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

// added by nuno
const getAllPetsImages = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM photos', (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

const getAllLikes = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM likes', (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

// like per pet id
const getLikePetId = async (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM likes WHERE pets_id = ? ', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

const makeLike = (body) => {
  return new Promise(function(resolve, reject) {
    connection.query('INSERT INTO likes (users_id, pets_id, comment) VALUES (?,?,?)', 
    [body.users_id, body.pets_id, body.comment], 
    (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  getUsers: getUsers,
  addUser: addUser,
  emailExists: emailExists,
  getUser: getUser,
  getAllPets:getAllPets,
  getPets: getPets,
  addPet:addPet,
  deletePet:deletePet,
  addImage:addImage,
  getImages: getImages,
  getAllPetsImages: getAllPetsImages,
  getAllLikes: getAllLikes,
  getLikePetId: getLikePetId,
  makeLike: makeLike
}
