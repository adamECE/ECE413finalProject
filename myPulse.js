// _________________ FIGURE THIS STUFF OUT ______________

const sessionUser = localStorage.getItem("username"); 
let heartRateData = null; 
const form = document.getElementById('update-form');
form.addEventListener('submit', getHR_Data);

// Change to XHR GET request later
async function getHR_Data(event) {
  event.preventDefault(); 
  const result = await fetch('/api/getUserHeartRateData?username=' + sessionUser, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => {
    if (res.status == 200) {
      heartRateData = res.heartRates; 
      console.log(res.heartRates);
    } else {
      //TODO: add some css or something to show error getting data
    }
}).catch((err) => {
  console.log(err);
})
}

//console.log(heartRateData);

//console.log(String(new Date()))
const unparsedStr = ['2022-12-07T17:52:22.046Z', '2022-12-07T17:51:06.765Z'];
let myPointsWeekly = [];
let myPointsDaily = [];
// get the past 7 days 
const past7Days = [...Array(7).keys()].map(index => {
    const date = new Date();
    date.setDate(date.getDate() - index);
  
    return date;
  });
  
  let past7DaysObjects = []; 
  past7Days.forEach((pastDay) => {
        past7DaysObjects.push(parseHR_Date(pastDay))
        //console.log(String(pastDay))
  });

  // daily view 
  past7DaysObjects.forEach((pastDay) => {
    // ideally check if current day here. 
    myPointsDaily.push({x: pastDay.hour + (pastDay.min/100), y: pastDay.heartRate}); 
  })


// weekly view 

// daily view 
JSC.Chart('chartDiv', {
    series: [
       {
          points: myPointsDaily
       }
    ]
 });


function parseHR_Date(tempDate) {
    //console.log(tempDate.getDay());
    dateTime = {
        year: tempDate.getFullYear(),
        month: tempDate.getMonth()+1,
        day: tempDate.getDay()+1,
        hour: tempDate.getHours(),
        min: tempDate.getMinutes(),
        heartRate: 1
    } 
    return dateTime; 
}

