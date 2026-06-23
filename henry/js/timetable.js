const styleHTML = document.getElementById("style");
const timetableHTML = document.getElementById("timetable")

var width = window.innerWidth
var height = window.innerHeight

// Time is a placeholder for first iterations. Will later get from the server
var timesString = ["8:30", "8:40", "9:20", "10:00", "10:20", "11:00", "11:40", "12:00", "12:40", "13:20", "14:00", "14:40", "15:20"]
var timesNum = [] // Stores the time as 'total number of minutes' as an integer

for (i=0;  i < timesString.length; i++) {
    var splitTimes = timesString[i].split(":") // Splits the time into hours and minutes
    timesNum.push(parseInt(splitTimes[0]) * 60 + parseInt(splitTimes[1])) // Hours * 60 + minutes
}

// The difference between the starting and ending time
var totalTimeRatio = timesNum[timesNum.length-1]-timesNum[0]

var cellHeights = [] // Uses totalTimeRatio to determine the cell heights
var cellText = []
for (i=1; i < timesNum.length; i++) {
    var startTime = timesNum[i-1]-timesNum[0] // When the subject starts in relation to the start of the day
    var endTime = timesNum[i]-timesNum[0] // When the subject ends in relation to the start of the day
    cellHeights.push((endTime-startTime)/totalTimeRatio*(height-50)) // Gets the ratio by using above variables
    cellText.push(["Module " + i + "<br> Lesson name " + i + "<br>" + timesString[i-1] + " - " + timesString[i] + "<br> Mr John"])
}

var tableHTML = ''
var styles = ''
// All CSS styling in a single function to make it collapsable for organisation
// CSS is in JS because it needs to be defined by variables
// Styling is important because things like colour coding are helpful for organisation apps like this
styling()
function styling() {
    // Adds all table cells to the table at the appropriate height. Cell has id "tableCell"+i and colour picker has id "tableColour"+i
    for (i=0; i < timesNum.length-1; i++) {
        tableHTML += `
        <tr style="height:` + cellHeights[i] + `">
            <td id ="tableCell`+i+`">
                <button id="tableButton`+i+`" style = "width:`+((width-20)/3-54)+`px;height:`+(cellHeights[i]-3)+`; border:none;+float:left; text-align: left; overflow-y: auto; outline: none; padding: 0;">`+cellText[i]+`</button>
                <input type = "color" id="tableColour`+i+`" style = "height: `+(cellHeights[i]-3)+`px; float:right; border-radius:50px; border: 2px solid black; outline:none; padding:0; background:black;"></input>
            </td>
        </tr>
        `
    }
    timetableHTML.innerHTML += tableHTML

    // Adds all css styling
    styles = `
    .tableWrapper {
        height:`+String(height-20)+`px;
        width:`+String((width-20)/3)+`px;

        margin-left: auto;
        margin-right: 0;

        overflow-y: auto;
        overflow-x: auto;
    }
    table {
        height:`+String(height-20)+`px;
        width:`+String((width-20)/3)+`px;
        
        border-collapse: collapse;
        white-space:nowrap;

        margin-left: auto; 
        margin-right: 0;
    }
    `
}

var tableColours = []
var tableCells = []
var tableButtons = []
for (let i = 0; i < timesNum.length-1; i++) {
    // All of these HTML IDs were made in styling
    tableColours.push(document.getElementById("tableColour"+i)) // The colour pickers.
    tableCells.push(document.getElementById("tableCell"+i)) // The table cells.
    tableButtons.push(document.getElementById("tableButton"+i)) // The table buttons.
}


for (let i = 0; i < tableColours.length; i++) {
    tableColours[i].addEventListener("input", function() { // Adds an event listener to every colour picker
        tableCells[i].style.backgroundColor = tableColours[i].value // Sets the table cell's background to the colour picked in the colour picker
        tableColours[i].style.backgroundColor = tableColours[i].value
        tableButtons[i].style.backgroundColor = tableColours[i].value
        // console.log(tableColours[i])
        let hex = tableColours[i].value
        let rgb = hexToRGBConverter(hex)
        
        // Detect brightness of rgb. Formula gotten from online.
        console.log(tableButtons[i].style.color)
        console.log("asd")
        if (0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2] >= 100) {
            // console.log(tableButtons[i].style)
            tableButtons[i].style.color = "rgb(0, 0, 0)"
            // console.log(0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2])
        }
        else {
            tableButtons[i].style.color = "rgb(255, 255, 255)"
            // console.log(tableButtons[i].style.color)
        }
        // console.log(rgb)
        // if (tableColours)
    })
}

// Function copied from a previous project
function hexToRGBConverter(hex) { // This converts hex codes to rgb values and sets the colour array to the rgba values
    const r = parseInt(hex.slice(1, 3), 16); // These 3 lines get the rgb values from the hex code
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b]
};

styleHTML.innerHTML = styles



console.log("penis")





fetch("/api.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ request: 'lessons', student_id:1 })  // Send a request to get crash type data
})
    //convert the response to json
    .then(response => response.json())
    //then do something with the data
    .then(data => {
        console.log(data)
    })
    //catch any errors and log them to the console
    .catch(error => console.error('Error:', error));