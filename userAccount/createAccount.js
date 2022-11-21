const form = document.getElementById('reg-form')
let errorMsg = document.getElementById("formErrors")
let errorList = document.getElementById("errorList")

form.addEventListener('submit', registerUser);

async function registerUser(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const deviceKey = document.getElementById('deviceKey').value;

    if (checkForm()){
        const result = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                deviceKey
            })
        }).then((res) => {
            location.replace('login.html');
        })
    }
}

const checkForm = () => {
    let name = document.getElementById("fullName")
    let password = document.getElementById("password")
    let confirmPassword  = document.getElementById("confirm-password")
    let hasNoErrors = true 
  
// check password length is between 10 to 20
    if(10 >=String(password.value).length || String(password.value).length >=20){
        showErrorMsg("Password must be between 10 and 20 characters.")
        password.classList.add("badInput")
        hasNoErrors = false
    } 

    let passwordProvided = true; 
    // check for lowercase char 
    if(String(password.value).toUpperCase()===String(password.value)){
        showErrorMsg("Password must contain at least one lowercase character.")
        password.classList.add("badInput")
        passwordProvided = false
        hasNoErrors = false
    } else if (String(password.value).length == 0){
        showErrorMsg("Password must contain at least one lowercase character.")
        password.classList.add("badInput")
        passwordProvided = false
        hasNoErrors = false
    }
 
    // check for uppercase char 
    if(String(password.value).toLowerCase()===String(password.value)){
        showErrorMsg("Password must contain at least one uppercase character.")
        password.classList.add("badInput")
        passwordProvided = false
        hasNoErrors = false
    } else if (String(password.value).length == 0){
        showErrorMsg("Password must contain at least one uppercase character.")
        password.classList.add("badInput")
        passwordProvided = false
        hasNoErrors = false
    }

    let digitRegex = /\d/
    if(digitRegex.test(password.value)==false){
        showErrorMsg("Password must contain at least one digit.")
        password.classList.add("badInput")
        passwordProvided = false
        hasNoErrors = false
    }

    if(String(password.value)!==String(confirmPassword.value) && passwordProvided){
        showErrorMsg("Password and confirmation password don't match.")
        confirmPassword.classList.add("badInput")
        hasNoErrors = false
    } 

    if(hasNoErrors){
        errorMsg.style.display = 'none';
        return true; 
    }
    return false; 
}

const showErrorMsg = (msg) => {
    errorMsg.style.display = 'block';
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    errorList.appendChild(li);
}