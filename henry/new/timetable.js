import { getAllStudents, getLessons } from "./timetable_api.js";

const styleHTML = document.getElementById("style");
const timetableHTML = document.getElementById("timetable")

var width = 280
var height = window.innerHeight - 250

// Time is a placeholder for first iterations. Will later get from the server
var timesString = ["08:30", "08:40", "09:20", "10:00", "10:20", "11:00", "11:40", "12:00", "12:40", "13:20", "14:00", "14:40", "15:20"]
var timesNum = [] // Stores the time as 'total number of minutes' as an integer

for (let i=0;  i < timesString.length; i++) {
    var splitTimes = timesString[i].split(":") // Splits the time into hours and minutes
    timesNum.push(parseInt(splitTimes[0]) * 60 + parseInt(splitTimes[1])) // Hours * 60 + minutes
}

let allLessons = [] // The text which is stored in the table cells

getCellText()

export async function getCellText() {
    var studentIds = await getAllStudents()
    let lessons = await getLessons(studentIds)

    // console.log(studentIds)
    // console.log(lessons)

    // Checks for the lesson time of all lessons by using nested FOR loops and saves it as a lesson number, e.g, lesson 1
    for (let i=0; i < lessons.length; i++) {
        for (let j=0; j < timesString.length; j++) {
            if (lessons[i][1] == timesString[j]) {
                lessons[i].unshift(j)
            }
        }
    }

    // Fill up the array with null so it can later be changed at specific indexes
    for (let i = 0; i < timesString.length - 1; i++) {
        allLessons.push(null)
    }

    // Uses same nested FOR loops as earlier, but checks for the lesson number instead of time
    for (let i = 0; i < allLessons.length; i++) {
        for (let j = 0; j < lessons.length; j++) {
            if (lessons[j][0] == i) {
                allLessons[i] = ("Module " + lessons[j][0] + "<br>" + lessons[j][1] + "<br>" + lessons[j][2] + " - " + lessons[j][3] + "<br>" + lessons[j][4])
            }
        }
    }

    for (let i = 0; i < allLessons.length; i++) {
        // Only runs if the DB had no data, because all indexes with data have already been changed to have text
        if (allLessons[i] == null) {
            allLessons[i] = "NO DATA"
        }
    }

    await styling()
}

// The difference between the starting and ending time
var totalTimeRatio = timesNum[timesNum.length-1]-timesNum[0]

var cellHeights = [] // Uses totalTimeRatio to determine the cell heights
// var cellText = []
for (let i=1; i < timesNum.length; i++) {
    var startTime = timesNum[i-1]-timesNum[0] // When the subject starts in relation to the start of the day
    var endTime = timesNum[i]-timesNum[0] // When the subject ends in relation to the start of the day
    cellHeights.push((endTime-startTime)/totalTimeRatio*(height-80)) // Gets the ratio by using above variables
}

var tableHTML = ''
var styles = ''

// All CSS styling in a single function to make it collapsable for organisation
// CSS is in JS because it needs to be defined by variables
// Styling is important because things like colour coding are helpful for organisation apps like this
async function styling() {
    // Adds all table cells to the table at the appropriate height. Cell has id "tableCell"+i and colour picker has id "tableColour"+i
    for (let i=0; i < timesNum.length-1; i++) {
        tableHTML += `
        <tr style="height:` + cellHeights[i] + `px ">
            <td id ="tableCell`+i+`" style = "width: `+(width - 60)+`px;">
                <button id="tableButton`+i+`" style = "width: `+(width - 70)+`px; height:`+(cellHeights[i])+`; border:none; float:left; text-align: left; overflow-y: auto; outline: none; padding: 0;">`+allLessons[i]+`</button>
            </td>
            <td>
                <input type="color" id="tableColour`+i+`"style="width:100%; height:100%; margin:0; padding:0; border:none; appearance:none; -webkit-appearance:none; background:none;"></input>
            </td>
        </tr>
        `
    }
    timetableHTML.innerHTML += tableHTML

    // Adds all css styling
    styles = `
    .tableWrapper {
        height:`+String(height-10)+`px;
        width: `+width+`px;

        overflow-y: auto;
        overflow-x: auto;
        display: block;
    }
    table {
        height:`+String(height-80)+`px;
        width:`+String(width)+`px;
        
        border-collapse: collapse;
        white-space:nowrap;
    }
    `

    await fillingCells()
}

async function fillingCells() {
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
            
            let hex = tableColours[i].value
            let rgb = hexToRGBConverter(hex)
            
            // Detect brightness of rgb. Formula gotten from online.
            if (0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2] >= 100) {
                tableButtons[i].style.color = "rgb(0, 0, 0)"
            }
            else {
                tableButtons[i].style.color = "rgb(255, 255, 255)"
            }
        })
    }

    styleHTML.innerHTML = styles
}

// Function copied from a previous project
function hexToRGBConverter(hex) { // This converts hex codes to rgb values and sets the colour array to the rgba values
    const r = parseInt(hex.slice(1, 3), 16); // These 3 lines get the rgb values from the hex code
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b]
};
