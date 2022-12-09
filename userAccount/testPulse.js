/*
!!!!!!!!!!!!!!!! REMEMBER TO ADD API KEY THIS ONE IS FAKE 
*/

const form = document.getElementById('login-form');
let errorMsg = document.getElementById("formErrors");
let errorList = document.getElementById("errorList");
form.addEventListener('submit', checkLogin);

async function checkLogin(event) {
    event.preventDefault(); 
    let username = document.getElementById('username').value;
    let deviceKey = document.getElementById('deviceID').value;
    let hr1 = document.getElementById('hr1').value;
    let hr2 = document.getElementById('hr2').value;
    let hr3 = document.getElementById('hr3').value;
    let heartRate = parseInt(String(hr1));
    let satOxygen = parseInt(String(hr2));
    let time = "Thu Dec "+hr3+" 2022 23:47:00 GMT-0700 (Mountain Standard Time)"; 

    const result = await fetch('/api/sendHeartRates?apiKey=fakeKey', {
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
