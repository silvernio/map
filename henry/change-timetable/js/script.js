const studentInput = document.getElementById("students");
const studentDatalist = document.getElementById("studentDatalist");

const teacherInput = document.getElementById("teachers");
const teacherDatalist = document.getElementById("teacherDatalist");

const subjectInput = document.getElementById("subject");
const module = document.getElementById("module");
const day = document.getElementById("day");


// STUDENT DATALIST IS TEMPORARY - WILL LATER GO INFO FROM SIGNED IN ACCOUNT
var studentIdEntry // Output of the function below

studentInput.addEventListener("input", function() { // Activates whenever the user types in the searchbox for locations
    let search = studentInput.value // User input

    fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: "searchAccounts", search: search})  // Sends an api request to get all locations which contain 'search'
    })

    .then(response => response.json())
    .then(data => {
        if (data.message) {
            return;
        }
        else { // If there is no error message
            // console.log(data)
            studentDatalist.innerHTML = "" // Resets the output, because '+=' is used later.

            for (i = 0; i < data.length; i++) { // Note that high number of options results in lag and user confusion
                if (data[i].is_teacher == 0) {
                    let studentName = (data[i].first_name + "," + data[i].last_name);

                    studentDatalist.innerHTML += "<option value="+studentName+"></option>" // Adds the option to the output
                }
            }
            studentIdEntry = data[0].account_id // Stores the current selection for later use
        }
    })
})

teacherInput.addEventListener("input", function() { // Activates whenever the user types in the searchbox for locations
    let search = teacherInput.value // User input

    fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: "searchAccounts", search: search})  // Sends an api request to get all locations which contain 'search'
    })

    .then(response => response.json())
    .then(data => {
        if (data.message) {
            return;
        }
        else { // If there is no error message
            // console.log(data)
            teacherDatalist.innerHTML = "" // Resets the output, because '+=' is used later.

            for (i = 0; i < data.length; i++) { // Note that high number of options results in lag and user confusion
                if (data[i].is_teacher == 1) {
                    let teacherName = (data[i].first_name + "," + data[i].last_name);

                    teacherDatalist.innerHTML += "<option value="+teacherName+"></option>" // Adds the option to the output
                }
            }
            teacherIdEntry = data[0].account_id // Stores the current selection for later use
        }
    })
})

var lessonNames = []
getLessons() // Only needs to be ran once, because it is not dynamic with user input
function getLessons() {
    fetch("/api.php", { // Gets the API script
        method: "POST", // Post is used because it's more private
        headers: {
            "Content-Type": "application/json" // Determines the format to be JSON
        },
        body: JSON.stringify({request: "allLessons"}) // Requests crash types from the api 
    })

    .then(response => response.json()) // Returns the search response as an object named 'data'
    .then(data => {
        if (data.message) { // Checks if there is an error message
            return;
        }
        else {
            for (let i = 0; i < data.length; i ++) {
                lessonNames.push(data[i].lesson_name)
            }
            lessonNames = removeDuplicates(lessonNames)
            console.log(lessonNames)
        }
    })
}

function removeDuplicates(array) {
    const uniqueArray = [...new Set(array)];
    return uniqueArray
}

function addToDB() {
    console.log(studentIdEntry)
}