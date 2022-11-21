const form = document.getElementById('login-form');
let errorMsg = document.getElementById("formErrors");
let errorList = document.getElementById("errorList");

form.addEventListener('submit', checkLogin);

async function checkLogin(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const result = await fetch('/api/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username,
          password
      })
  }).then((res) => {
    if (res.status==200){
      console.log("User has logged in");
      location.replace('loggedIn.html');
    } else {
      showErrorMsg("Username or password is incorrect.");
      console.log(res.status + "," + res.error)
    }
  })
    

}

const showErrorMsg = (msg) => {
  errorMsg.style.display = 'block';
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(msg));
  errorList.appendChild(li);
}

