// const studentInput = document.getElementById("students");
// const studentDatalist = document.getElementById("studentDatalist");

const teacherInput = document.getElementById("teachers");
const teacherDatalist = document.getElementById("teacherDatalist");


const subjectInput = document.getElementById("subjects");
const subjectDatalist = document.getElementById("subjectDatalist");

const module = document.getElementById("module");
const day = document.getElementById("day");

const times = ["8:40", "9:20", "10:20", "11:00", "12:00", "12:40", "14:00", "14:40"]

// STUDENT DATALIST IS TEMPORARY - WILL LATER GO INFO FROM SIGNED IN ACCOUNT
// var studentIdEntry // Output of the function below

// studentInput.addEventListener("input", function() { // Activates whenever the user types in the searchbox for locations
//     let search = studentInput.value // User input

//     fetch("/api.php", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({request: "searchAccounts", search: search})  // Sends an api request to get all locations which contain 'search'
//     })

//     .then(response => response.json())
//     .then(data => {
//         if (data.message) {
//             return;
//         }
//         else { // If there is no error message
//             // console.log(data)
//             studentDatalist.innerHTML = "" // Resets the output, because '+=' is used later.

//             for (let i = 0; i < data.length; i++) { // Note that high number of options results in lag and user confusion
//                 if (data[i].is_teacher == 0) {
//                     let studentName = (data[i].first_name + "," + data[i].last_name);

//                     studentDatalist.innerHTML += "<option value="+studentName+"></option>" // Adds the option to the output
//                 }
//             }
//             studentIdEntry = data[0].account_id // Stores the current selection for later use
//         }
//     })
// })

var teacherIdEntry // Output of the function below
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

            for (let i = 0; i < data.length; i++) { // Note that high number of options results in lag and user confusion
                if (data[i].is_teacher == 1) {
                    let teacherName = (data[i].first_name + "," + data[i].last_name);

                    teacherDatalist.innerHTML += "<option value="+teacherName+"></option>" // Adds the option to the output
                }
            }
            teacherIdEntry = data[0].account_id // Stores the current selection for later use
        }
    })
})

var subjectNames = []
getLessons() // Only needs to be ran once, because it is not dynamic with user input
function getLessons() {
    fetch("/api.php", { // Gets the API script
        method: "POST", // Post is used because it's more private
        headers: {
            "Content-Type": "application/json" // Determines the format to be JSON
        },
        body: JSON.stringify({request: "allLessons"}) // Requests all lessons from the api 
    })

    .then(response => response.json()) // Returns the search response as an object named 'data'
    .then(data => {
        if (data.message) { // Checks if there is an error message
            return;
        }
        else {
            for (let i = 0; i < data.length; i ++) {
                subjectNames.push(data[i].lesson_name)
            }
            subjectNames = removeDuplicates(subjectNames)

            subjectDatalist.innerHTML = ""
            for (let i = 0; i < subjectNames.length; i++) {
                subjectDatalist.innerHTML += "<option value="+subjectNames[i]+"></option>" // Adds the option to the output
            }
        }
    })
}

function removeDuplicates(array) {
    const uniqueArray = [...new Set(array)];
    return uniqueArray
}

async function addToDB() {
    var accountId

    let account = await getAccount()
    if (!account.first_name) {
        return
    }
    else {
        const response = await fetch("/api.php", { // Gets the API script
            method: "POST", // Post is used because it's more private
            headers: {
                "Content-Type": "application/json" // Determines the format to be JSON
            },
            body: JSON.stringify({request: "getAccountId", first_name: account.first_name, last_name: account.last_name}) // Requests account ID from the api 
        })
    
        const data = await response.json()

        if (data.message) { // Checks if there is an error message
            console.log(data)
            return;
        }
        else {
            accountId = data[0].account_id
        }
    }

    var lessonId
    let startTime = times[module.value-1]
    // console.log(startTime)
    const response = await fetch("/api.php", { // Gets the API script
        method: "POST", // Post is used because it's more private
        headers: {
            "Content-Type": "application/json" // Determines the format to be JSON
        },
        body: JSON.stringify({request: "getLessonId", module: module.value, teacher_id: teacherIdEntry, start_time: startTime, day: day.value}) // Requests account ID from the api 
    })

    const data = await response.json()

    // WORKING HERE

    if (data.message) { // Checks if there is an error message
        console.log(data)
        return;
    }
    else {
        accountId = data[0].account_id
    }

    // console.log(accountId)

    var input = [accountId, teacherIdEntry, subjectInput.value, module.value, day.value]
    console.log(input)

    fetch("/php/insert.php", {
        method: "POST",
        body: JSON.stringify({request: "updateTimetable", input: input})
    })
    .then(response => response.text())
    .then(text => console.log(text)) // Log success or error message
    .catch(error => console.error("Error:", error));

    // console.log(input)
}