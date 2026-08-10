import { getAllStudents, getLessons } from "./timetable_api.js";

const styleHTML = document.getElementById("style");
const timetableHTML = document.getElementById("timetable")

// Formerly used window.innerWidth and window.innerHeight, but it was scrapped after integrating the map into the timetable.
var width = 280
var height = 625

// Time is a placeholder from the first iteration. Could be improved, but it works.
var timesString = ["08:40", "09:20", "10:00", "10:20", "11:00", "11:40", "12:00", "12:40", "13:20", "14:00", "14:40", "15:20"]
var startTimeString = ["08:40", "09:20", "10:20", "11:00", "12:00", "12:40", "14:00", "14:40"] // VERY jank solution. Could be implemented better
// 'timesNum' is an artefact leftover from when the table cell height was reliant of lesson length.
var timesNum = [] // Stores the time as 'total number of minutes' as an integer

for (let i = 0; i < timesString.length; i++) {
    var splitTimes = timesString[i].split(":") // Splits the time into hours and minutes
    timesNum.push(parseInt(splitTimes[0]) * 60 + parseInt(splitTimes[1])) // Hours * 60 + minutes
}

// All uses of 'currentLessons' and 'lessonColours' are done by the map dev, not the timetable dev.
export const currentLessons = [] // stores current lesson data
export const lessonColours = [] // stores current lesson colours
let allLessons = [] // The text which is stored in the table cells

getCellText()

export async function getCellText() {
    // var studentIds = await getAllStudents()
    let lessons = await getLessons(studentIds)

    // Checks for the lesson time of all lessons by using nested FOR loops and saves it as a lesson number, e.g, lesson 1
    for (let i = 0; i < lessons.length; i++) {
        for (let j = 0; j < startTimeString.length; j++) {
            if (lessons[i][1] == startTimeString[j]) {
                lessons[i].unshift(j + 1)
            }
        }
    }

    currentLessons.length = 0;
    lessonColours.length = 0;

    // Fill up the array with null so it can later be changed at specific indexes
    for (let i = 0; i < startTimeString.length; i++) {
        allLessons.push(null)
        // also init lessons and colours
        currentLessons.push(null)
        lessonColours.push(null)
    }

    // Uses same nested FOR loops as earlier, but checks for the lesson number instead of time
    for (let i = 0; i < allLessons.length; i++) {
        for (let j = 0; j < lessons.length; j++) {
            if (lessons[j][0] == i+1) {
                allLessons[i] = `
                Module ${lessons[j][0]}, ${lessons[j][2]} - ${lessons[j][3]} <br> 
                ${lessons[j][1]} <strong> ${lessons[j][5]} </strong> <br>  
                ${lessons[j][4]}
                `
                currentLessons[i] = lessons[j];
            }
        }
    }

    for (let i = 0; i < allLessons.length; i++) {
        // Only runs if the DB had no data, because all indexes with data have already been changed to have text
        if (allLessons[i] == null) {
            allLessons[i] = "" // Convert to a string to make it valid HTML
        }
    }

    await styling()
}

// The difference between the starting and ending time
var totalTimeRatio = timesNum[timesNum.length - 1] - timesNum[0]

var cellHeights = [] // Uses totalTimeRatio to determine the cell heights
// var cellText = []
for (let i = 1; i < timesNum.length; i++) {
    var startTime = timesNum[i - 1] - timesNum[0] // When the subject starts in relation to the start of the day
    var endTime = timesNum[i] - timesNum[0] // When the subject ends in relation to the start of the day
    cellHeights.push(50)//(endTime - startTime) / totalTimeRatio * (height - 80)) // Gets the ratio by using above variables
    cellHeights.push(50)//(endTime - startTime) / totalTimeRatio * (height - 80)) // Gets the ratio by using above variables
}

var tableHTML = ''
var styles = ''

export const hovered = {v: null};

// All CSS styling in a single function to make it collapsable for organisation
// CSS is in JS because it needs to be defined by variables
// Styling is important because things like colour coding are helpful for organisation apps like this
async function styling() {
    // Adds all table cells to the table at the appropriate height. Cell has id "tableCell"+i and colour picker has id "tableColour"+i
    for (let i = 0; i < startTimeString.length; i++) {
        tableHTML += `
        <tr style="height:` + cellHeights[i] + `px; overflow: hidden;">
            <td class="tableCell" id="tableCell`+ i + `" style = "width: ` + (width - 70) + `px;">
                <button class="tableButton" id="tableButton`+ i + `" style = "width: ` + (width - 80) + `px; height:` + (cellHeights[i]) + `px; border:none; float:left; text-align: left; font-size: 14px; outline: none; padding: 0; display: block; overflow: hidden;">` + allLessons[i] + `</button>
            </td>
            <td>
                <input type="color" id="tableColour`+ i + `"style="width:100%; height:100%; margin:0; padding:0; border:none; appearance:none; -webkit-appearance:none; background:none;"></input>
            </td>
        </tr>
        `

        // DONE BY MAP DEV - START
        setTimeout(() => {
            // update the hovered state with the index on hover
            document.getElementById(`tableButton${i}`).onpointerover = () => {
                hovered.v = i;
            }
             document.getElementById(`tableButton${i}`).onpointerout = () => {
                hovered.v = null;
            }

            document.getElementById(`tableButton${i}`).onclick = () => {
                console.log("cell " + i)
            }
        })
        // DONE BY MAP DEV - END
    }

    timetableHTML.innerHTML += tableHTML

    // Adds all css styling
    styles = `
    .tableWrapper {
        height:`+ String(height - 20) + `px;
        width: `+ width + `px;

        overflow-y: auto;
        overflow-x: auto;
        display: block;
    }
    table {
        height:`+ String(height - 90) + `px;
        width:`+ String(width) + `px;
        
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
    for (let i = 0; i < startTimeString.length; i++) {
        // All of these HTML IDs were made in styling
        tableColours.push(document.getElementById("tableColour" + i)) // The colour pickers.
        tableCells.push(document.getElementById("tableCell" + i)) // The table cells.
        tableButtons.push(document.getElementById("tableButton" + i)) // The table buttons.
    }




    for (let i = 0; i < tableColours.length; i++) {
        tableColours[i].addEventListener("input", function () { // Adds an event listener to every colour picker
            // update the lesson colours state
            lessonColours[i] = tableColours[i].value;

            tableCells[i].style.backgroundColor = tableColours[i].value // Sets the table cell's background to the colour picked in the colour picker
            tableColours[i].style.backgroundColor = tableColours[i].value
            tableButtons[i].style.backgroundColor = tableColours[i].value

            // HTML stores colour as a hex code, so a hexToRGBConverter is used.
            let hex = tableColours[i].value
            let rgb = hexToRGBConverter(hex)

            
            localStorage.setItem('colour' + i, hex); // Mapdev

            // Detect brightness of rgb. Formula gotten from online.
            if (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] >= 100) {
                tableButtons[i].style.color = "rgb(0, 0, 0)"
            }
            else {
                tableButtons[i].style.color = "rgb(255, 255, 255)"
            }
        })
        // DONE BY MAP DEV - START
        tableColours[i].value = localStorage.getItem('colour' + i) || '#cccccc';
        tableColours[i].dispatchEvent(new Event("input"));
    }

    styleHTML.innerHTML = styles
    // DONE BY MAP DEV - END
}

// Function copied from a previous project
function hexToRGBConverter(hex) { // This converts hex codes to rgb values and sets the colour array to the rgba values
    const r = parseInt(hex.slice(1, 3), 16); // These 3 lines get the rgb values from the hex code
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b]
};
