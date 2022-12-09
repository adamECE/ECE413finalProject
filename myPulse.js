// _________________ FIGURE THIS STUFF OUT ______________

const sessionUser = localStorage.getItem("username"); 
let heartRateData = null; 
const form = document.getElementById('update-form');
const filterBtn = document.getElementById('filter-btn');
const refreshBTn = document.getElementById('refresh-btn');
const startTimeFilter = document.getElementById('filter-start');
const endTimeFilter = document.getElementById('filter-end');
const dayFilter = document.getElementById('filter-day'); 
const dailyDataPara = document.getElementById('daily-data-displayed')
const weeklyDataPara = document.getElementById('weekly-data-displayed')
const dailyMaxMin = document.getElementById('daily-maxmin')
const weeklyMaxMin = document.getElementById('weekly-maxmin')
filterBtn.addEventListener('click', getHR_DataWithConstraints);


// Change to XHR GET request later
async function getHR_Data() {
  const result = await fetch('/api/getUserHeartRateData?username=' + sessionUser, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => { 
  return res.json()
}).then((data) => handleHeartRateData(data.heartRates)
).catch((err) => {
  console.log(err);
})
}

// Change to XHR GET request later
async function getHR_DataWithConstraints() {
  if((startTimeFilter.value).length > 0 || (endTimeFilter.value).length > 0 || (dayFilter.value).length>0){
    const result = await fetch('/api/getUserHeartRateData?username=' + sessionUser, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  }).then((res) => { 
    return res.json()
  }).then((data) => handleHeartRateDataWithConstraints(data.heartRates)
  ).catch((err) => {
    console.log(err);
  })
  }
  // else maybe add something here. 
}

function handleHeartRateDataWithConstraints(heartRateData){
  let parsedHR_Data = [];
  heartRateData.forEach((data)=>{
    date = new Date(String(data.time));
    parsedHR_Data.push(parseHR_Date(date, data.heartRate, data.satOxygen)); 
  })
  // change these two functions to account for constraints
  let dailyHR = filteredParseDailyHR(parsedHR_Data); // these may not be true later
  let dailyO2 = filteredParseDailyO2(parsedHR_Data);
  let weeklyHR = parseWeeklyHR(parsedHR_Data);
  let weeklyO2= parseWeeklyO2(parsedHR_Data);

  handleParsedHR_Data(dailyHR, dailyO2, weeklyHR, weeklyO2);

  JSC.Chart('dailyHR-data', {
    type: 'vertical column',
    series: [
       {
          name: "Heart Rate",
          points: dailyHR 
       },
       {
        name: "O2 Saturation",
        points: dailyO2 
       }
    ]
 }); 
 JSC.Chart('weeklyHR-data', {
  series: [
     {
        name: "Heart Rate",
        points: weeklyHR 
     },
     {
      name: "O2 Saturation",
      points: weeklyO2 
     }
  ]
});
  
}



function handleHeartRateData(heartRateData){
  let parsedHR_Data = [];
  heartRateData.forEach((data)=>{
    date = new Date(String(data.time));
    parsedHR_Data.push(parseHR_Date(date, data.heartRate, data.satOxygen)); 
  })
  
  let dailyHR = parseDailyHR(parsedHR_Data);
  let dailyO2 = parseDailyO2(parsedHR_Data);
  let weeklyHR = parseWeeklyHR(parsedHR_Data);
  let weeklyO2= parseWeeklyO2(parsedHR_Data);

  handleParsedHR_Data(dailyHR, dailyO2, weeklyHR, weeklyO2)

  JSC.Chart('dailyHR-data', {
    type: 'vertical column',
    series: [
       {
          name: "Heart Rate",
          points: dailyHR 
       },
       {
        name: "O2 Saturation",
        points: dailyO2 
       }
    ]
 }); 
 JSC.Chart('weeklyHR-data', {
  series: [
     {
        name: "Heart Rate",
        points: weeklyHR 
     },
     {
      name: "O2 Saturation",
      points: weeklyO2 
     }
  ]
});
  
}

function filteredParseDailyHR(dataDates) {
  let today = (new Date()).getDay();
  if((dayFilter.value).length>0){
    today = (new Date(dayFilter.value)).getDay(); 
  } 
  //console.log(dataDates[6].day, today)
  
  let dataPoints = []; 
  let startInfo = convertTimeToInts(startTimeFilter.value, true);
  let startHour = startInfo.hour;
  let startMin = startInfo.min; 
  let endInfo = convertTimeToInts(endTimeFilter.value, false); 
  let endHour = endInfo.hour;
  let endMin = endInfo.min;
 
  dataDates.forEach((data) => {
    if((data.day+1) == today 
        && checkWithinTimeConstraint(data, startHour, startMin, endHour, endMin )){
      
      let title = data.hour + ':' + data.min;
      dataPoints.push(
        {
          x: title,
          y: parseInt(data.heartRate)
        });
    }
  })

  return dataPoints; 
}

function filteredParseDailyO2(dataDates) {
  let today = (new Date()).getDay();
  if((dayFilter.value).length>0){
    today = (new Date(dayFilter.value)).getDay(); 
  } 
  
  let dataPoints = []; 
  let startInfo = convertTimeToInts(startTimeFilter.value, true);
  let startHour = startInfo.hour;
  let startMin = startInfo.min; 
  let endInfo = convertTimeToInts(endTimeFilter.value, false); 
  let endHour = endInfo.hour;
  let endMin = endInfo.min;
 
  dataDates.forEach((data) => {
    if((data.day+1) == today 
        && checkWithinTimeConstraint(data, startHour, startMin, endHour, endMin )){
      
      let title = data.hour + ':' + data.min;
      dataPoints.push(
        {
          x: title,
          y: parseInt(data.satOxygen)
        });
    }
  })

  return dataPoints; 
}

function parseDailyHR(dataDates) {
  let today = (new Date()).getDay();
  let dataPoints = []; 

  dataDates.forEach((data) => {
    if((data.day+1) == today){
      let title = data.hour + ':' + data.min;
      dataPoints.push(
        {
          x: title,
          y: parseInt(data.heartRate)
        });
    }
  })

  return dataPoints; 
}

function parseDailyO2(dataDates) {
  let today = (new Date()).getDay();
  let dataPoints = []; 

  dataDates.forEach((data) => {
    if((data.day+1) == today){
      let title = data.hour + ':' + data.min;
      dataPoints.push(
        {
          x: title,
          y: parseInt(data.satOxygen)
        });
    }
  })

  return dataPoints; 
}

function parseWeeklyHR(dataDates) {
  let dataPoints = []; 

  dataDates.forEach((data) => {
    //console.log(data.day)
    if(checkIfPast7Days(data)){
      let title = (data.month+1) + ' ' + convertIntDayToStr(data.day);
      dataPoints.push(
        {
          x: title,
          y: parseInt(data.heartRate)
        });
    }
  })

  return dataPoints; 
}

function parseWeeklyO2(dataDates) {
  let dataPoints = []; 

  dataDates.forEach((data) => {
    //console.log(data.day)
    if(checkIfPast7Days(data)){
      let title = (data.month+1) + ' ' + convertIntDayToStr(data.day);
      dataPoints.push(
        {
          x: title,
          y: parseInt(data.satOxygen)
        });
    }
  })

  return dataPoints; 
}

// get the past 7 days 
function getPast7Days() {
  const past7Days = [...Array(7).keys()].map(index => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  
    return date;
  });
  
  let past7DaysObjects = []; 
  past7Days.forEach((pastDay) => {
        past7DaysObjects.push(
          {
            month: pastDay.getMonth(), 
            day: pastDay.getDay(),
            year: pastDay.getFullYear() 
          })
  });

  return past7DaysObjects; 
}

function parseHR_Date(tempDate, heartRate, satOxygen) {
    dateTime = {
        year: tempDate.getFullYear(),
        month: tempDate.getMonth(),
        day: tempDate.getDay(),
        hour: tempDate.getHours(),
        min: tempDate.getMinutes(),
        heartRate: heartRate,
        satOxygen: satOxygen
    } 
    return dateTime; 
}

function checkDaysMatch(date){
  let inPastWeek = false; 
    let isTrue = false;
      if(date.day == past.day){
        isTrue = true;
      } else {isTrue = false}
      if(date.month == past.month){
        isTrue = true;
      } else {isTrue = false}
      if(date.year == past.year){
        isTrue = true;
      } else {isTrue = false}
      if(isTrue){
        inPastWeek=true;
      };
    

  return inPastWeek;
}

function checkIfPast7Days(date){
  let pastWeek = getPast7Days();
  let inPastWeek = false; 
  pastWeek.forEach((past)=>{
    let isTrue = false;
    if(date.day == past.day){
      isTrue = true;
    } else {isTrue = false}
    if(date.month == past.month){
      isTrue = true;
    } else {isTrue = false}
    if(date.year == past.year){
      isTrue = true;
    } else {isTrue = false}
    if(isTrue){
      inPastWeek=true;
    };
  })
  return inPastWeek;
}

function convertIntDayToStr (day) {
  days = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
  return days[day]; 
}

function checkWithinTimeConstraint (data, startHour, startMin, endHour, endMin) { 
  let dataTime = data.hour + (data.min/100);
  let startTime = startHour + (startMin/100);
  let endTime = endHour + (endMin/100);

  if(dataTime > startTime && dataTime < endTime){
    return true;
  } else {
    //console.log(dataTime, startTime, endTime);
    return false; 
  }
}

function convertTimeToInts (time, isStart) {
  let hr = ''
  let min = ''; 

  if(time.length==0){
    if(isStart){
      hr = '0';
      min = '0'; 
    } else {
      hr = '23';
      min = '59';
    }
  } else {
    hr = time.slice(0,2);
    min = time.slice(3,5); 
  }
  hr = parseInt(hr); 
  min = parseInt(min);


  return {hour: hr, min: min}; 
}

function handleParsedHR_Data(dailyHR, dailyO2, weeklyHR, weeklyO2) {
  let davgHR = calculateAvg(dailyHR);
  let davgO2= calculateAvg(dailyO2);
  let wavgHR =  calculateAvg(weeklyHR);
  let wavgO2 =  calculateAvg(weeklyO2);
  let dailyHrMaxMin = calculateMaxMin(dailyHR);
  let dailyO2MaxMin = calculateMaxMin(dailyO2);
  let weeklyHrMaxMin = calculateMaxMin(weeklyHR);
  let weeklyO2MaxMin = calculateMaxMin(weeklyO2);

  davgHR = Math.round(davgHR * 100) / 100;
  davgO2 = Math.round(davgO2 * 100) / 100;
  wavgHR = Math.round(wavgHR * 100) / 100;
  wavgO2 = Math.round(wavgO2 * 100) / 100;

  dailyDataPara.innerText = "avg heart rate: " +  davgHR
              + ', avg oxygen saturation level: ' + davgO2;
  weeklyDataPara.innerText = "avg heart rate: " +  wavgHR
              + ', avg oxygen saturation level: ' + wavgO2;
  dailyMaxMin.innerText = "heart rate max: " + dailyHrMaxMin.max  
              + ' - min: ' + dailyHrMaxMin.min + ", oxygen saturation max: " 
              + dailyO2MaxMin.max + " - min: " + dailyO2MaxMin.min;
  weeklyMaxMin.innerText = "heart rate max: " + weeklyHrMaxMin.max  
              + ' - min: ' + weeklyHrMaxMin.min + ", oxygen saturation max: " 
              + weeklyO2MaxMin.max + " - min: " + weeklyO2MaxMin.min;
}

function calculateMaxMin(toCalculate){
  let max = -1;
  let min = 1000; 
  toCalculate.forEach((data) => {
    if(data.y > max){
      max = data.y;
    }
    if (data.y < min) {
      min = data.y; 
    }
  })
  return {max:max, min:min}; 
}

function calculateAvg(toCalculate) {
  let total = 0; 
  toCalculate.forEach((data) => {total+=data.y})
  let avg = total / toCalculate.length
  return avg; 
}
