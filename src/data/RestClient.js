
async function getAccount(id) {
  let response = await fetch(`http://localhost:4412/api/user/${id}`);
  return response.json()
}

function newPet(data) {
  fetch('http://localhost:4412/api/newpet', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .catch(error => alert("Failed to add new pet. Try later!"))
    .then(response => alert("New pet added!"))
}

function update(isUser, data) {
  (isUser) ?
    fetch('http://localhost:4412/api/updateuser', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response))
    :
    fetch(`http://localhost:4412/api/updatepet`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response))
}

module.exports = {
  getAccount: getAccount,
  update: update,
  newPet: newPet
}