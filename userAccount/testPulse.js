const form = document.getElementById('login-form');
let errorMsg = document.getElementById("formErrors");
let errorList = document.getElementById("errorList");

form.addEventListener('submit', checkLogin);

async function checkLogin(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const deviceKey = document.getElementById('deviceID').value;
    const hr1 = document.getElementById('hr1').value;
    const hr2 = document.getElementById('hr2').value;
    const heartRate = parseInt(String(hr1));
    const satOxygen = parseInt(String(hr2));
    const time = String(new Date()); 

    const result = await fetch('/api/sendHeartRate?apiKey=' + process.env.MAIN_KEY, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          deviceKey,
          time, 
          heartRate,
          satOxygen
      })
  }).then((res) => {
    if (res.status==200){
      console.log("i guess it was posted?"); 
    } else {
      showErrorMsg("Something was incorrect.");
      console.log(res.status + "," + res.error)
    }
  })
    

}
