// moment.js
var date = moment().format("dddd, MMMM Do, YYYY");

//Variables declaration

var hourMap = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM",
                "1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"]; 

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"];

var currentDate = ""; 

var currentDateString = ""; 
var currentHour = 9; 
var timeEntries = []; 
var createRow = document.querySelector("row time-block");
// Localstorage variable
var timeEntriesName = "workDaySchedulerList"; 

var initialTime = 9; 
var finalTime = 17; 

displayCurrentDate();
timeContainer(); 
localStorageTime(); 

//Jquery for buttons
$(".saveBtn").click(btnSave); 

// Create time container
function timeContainer() {
  var containerDiv = $(".container");
  for (var hourContainer=initialTime; hourContainer <= finalTime; hourContainer++) {
      var createRow = '<div class="row time-block"> ' +
          '<div class="col-md-1 hour">' + hourMap[hourContainer] + '</div> ';
      
      if (hourContainer < currentHour) {
          createRow = createRow + '<textarea class="col-md-10 description past" id="text' + 
              hourMap[hourContainer] + '"></textarea> ';
              
      }
      else if (hourContainer === currentHour) {
          createRow = createRow + '<textarea class="col-md-10 description present" id="text' + 
              hourMap[hourContainer] + '"></textarea> ';
      }
      else {
          createRow = createRow + '<textarea class="col-md-10 description future" id="text' + 
              hourMap[hourContainer] + '"></textarea> ';
      };

      // add icon to the button
      createRow = createRow + '<button class="btn oi oi-spreadsheet saveBtn col-md-1" value="' + hourMap[hourContainer] + '"></button> ' +
          '</div>';
      containerDiv.append(createRow);
      
  }
};

// Display time displayCurrentDate()
function displayCurrentDate() {
    
    var today = new Date(); 
    
    var day = today.getDate();
    var ordNumber = "th";
  
    currentHour = today.getHours(); 
  
    if (day < 10) {
        currentDate = today.getFullYear() + months[today.getMonth()] + "0" + day; 
    }
    else {
        currentDate = today.getFullYear() + months[today.getMonth()] + day;
    }

    // Ordinal number correction
    if ((day === 1) || (day === 21) || (day === 31)) {
        ordNumber = "st";
    }
    else if ((day === 2) || (day === 22)) {
        ordNumber = "nd";
    }
    else if ((day === 3) || (day === 23)) {
        ordNumber = "rd";
    }
  //Display date
    currentDateString = days[today.getDay()] + ", " + months[today.getMonth()] + " " + 
        day + ordNumber + ", " + today.getFullYear() +"."; 
    $("#currentDay").text(date); 
  };
  
// Load from localstorage
function localStorageTime() {
  var timeEntryList = JSON.parse(localStorage.getItem(timeEntriesName));

  if (timeEntryList) {
      timeEntries = timeEntryList;
  }

  for (var i=0; i<timeEntries.length; i++) {
      if (timeEntries[i].day == currentDate) {
          $("#text"+timeEntries[i].time).val(timeEntries[i].text); 
      }
  }
};

// Button function btnSave
function btnSave() {
    var hourContainer = $(this).val(); 
    var entryFound = false;
    var newEntryIndex = timeEntries.length; 
    var newEntry = {day: currentDate, time: hourContainer, text: $("#text"+hourContainer).val()}; 

    function timeGreater(time1,time2) {
        var num1 = parseInt(time1.substring(0, time1.length-2)); 
        var num2 = parseInt(time2.substring(0, time2.length-2)); 
        
        var per1 = time1.substr(-2,2); 
        var per2 = time2.substr(-2,2); 

        // Change 12 to 0
        if (num1 === 12) {
            num1 = 0;
        }
        if (num2 === 12) {
            num2 = 0;
        }

        // AM < PM
        if (per1 < per2) {
            return false; 
        }
        // PM > AM
        else if (per1 > per2) {
            return true; 
        }
        else {
            return (num1 > num2);
        }
    };

// Add another entry
    for (var i=0; i<timeEntries.length; i++) {
        if (timeEntries[i].day == currentDate) {
            if (timeEntries[i].time == hourContainer) {
                timeEntries[i].text = newEntry.text; 
                entryFound = true; 
                break;
            }
            else if (timeGreater(timeEntries[i].time, hourContainer)) {
                newEntryIndex = i;
                break;
            }
        }
        else if (timeEntries[i].day > currentDate) {
            newEntryIndex = i;
            break;
        }
    }

    // New entry
    if (!entryFound) {
        timeEntries.splice(newEntryIndex, 0, newEntry);
    }

    localStorage.setItem(timeEntriesName, JSON.stringify(timeEntries));
};


