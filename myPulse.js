const form = document.getElementById('login-form');
let errorMsg = document.getElementById("formErrors");
let errorList = document.getElementById("errorList");

form.addEventListener('submit', checkLogin);

async function checkLogin(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const deviceID = document.getElementById('deviceID').value;
    const hr1 = document.getElementById('hr1').value;
    const hr2 = document.getElementById('hr2').value;
    const hr3 = document.getElementById('hr3').value;
    const hr4 = document.getElementById('hr4').value;
    const hr5 = document.getElementById('hr5').value;
    const heartRates = [hr1, hr2, hr3, hr4, hr5]; 
    const dateTime = getParsedCurrentTime();

    const heartRateInfo = {
      dateTime,
      heartRates
    }

    const result = await fetch('/api/testHeartRate', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          deviceID,
          heartRateInfo
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

const getParsedCurrentTime = () => {
  let today = new Date()
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date+' '+time;
}
