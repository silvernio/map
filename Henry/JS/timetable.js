const styleHTML = document.getElementById("style");
const timetableHTML = document.getElementById("timetable")

var width = window.innerWidth
var height = window.innerHeight

// Time is a placeholder for first iteration. Will later get from the server
var timesString = ["8:30", "8:40", "9:20", "10:00", "10:20", "11:00", "11:40", "12:00", "12:40", "13:20", "14:00", "14:40", "15:20"]
var timesNum = [] // Stores the time as 'total number of minutes'

for (i=0;  i < timesString.length; i++) {
    var splitTimes = timesString[i].split(":")
    timesNum.push(parseInt(splitTimes[0]) * 60 + parseInt(splitTimes[1]))
}

var totalTimeRatio = timesNum[timesNum.length-1]-timesNum[0]

var cellHeights = []
for (i=1; i < timesNum.length; i++) {
    var startTime = timesNum[i-1]-timesNum[0]
    var endTime = timesNum[i]-timesNum[0]
    cellHeights.push((endTime-startTime)/totalTimeRatio*(height-20))
}

var tableHTML
for (i=1; i < timesNum.length; i++) {
    tableHTML += `
    <tr>
        <td>
            test
        </td>
    </tr>
`
}

const styles = `
.tableWrapper {
    height:`+String(height-20)+`px;
    width:`+String((width-20)/3)+`px;

    margin-left: auto;
    margin-right: 0;

    overflow-y: auto;
    overflow-x: auto;
}
tr, td {
    border: 1px solid black;
}
table {
    height:`+String(height-20)+`px;
    width:`+String((width-20)/3)+`px;
    
    border-collapse: collapse;
    white-space:nowrap;

    margin-left: auto; 
    margin-right: 0;
}
th {
    position: sticky;
    top: 0;
    background-color: grey;

    box-shadow:
        inset 0 1px 0 black,
        inset 0 -1px 0 black,
        inset 1px 0 0 black,
        inset -1px 0 0 black;
}
`
timetableHTML.innerHTML += tableHTML
// const tableHTML = ``

styleHTML.innerHTML = styles