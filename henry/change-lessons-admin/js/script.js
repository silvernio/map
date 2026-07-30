const allHTML = document.getElementById("everything")
// allHTML.remove()
setup()
var account
async function setup() {
    account = await getAccount()
    // console.log(account)
    if (!account.first_name) {
        alert("You are not signed in.")
    }
    else if (account.is_teacher == 0) {
        alert("You not an admin/teacher.")
    }
    else if (account.is_teacher == 1) {
        document.body.appendChild(allHTML)
    }
}

const mapInput = document.getElementById("maps");
const mapDatalist = document.getElementById("mapDatalist");

const teacherInput = document.getElementById("teachers");
const teacherDatalist = document.getElementById("teacherDatalist");

const classroomInput = document.getElementById("classrooms");
const classroomDatalist = document.getElementById("classroomDatalist");

const lessonName = document.getElementById("lessonName");
const module = document.getElementById("module");
const day = document.getElementById("day");

const times = ["8:40", "9:20", "10:20", "11:00", "12:00", "12:40", "14:00", "14:40"]
const endTimes = ["9:20", "10:20", "11:00", "12:00", "12:40", "14:00", "14:40", "15:20"]

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

var mapIdEntry // Output of the function below
mapInput.addEventListener("input", function() { // Activates whenever the user types in the searchbox for locations
    let search = mapInput.value // User input

    fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: "searchMaps", search: search})  // Sends an api request to get all locations which contain 'search'
    })

    .then(response => response.json())
    .then(data => {
        if (data.message) {
            return;
        }
        else { // If there is no error message
            // console.log(data)
            mapDatalist.innerHTML = "" // Resets the output, because '+=' is used later.

            for (let i = 0; i < data.length; i++) { // Note that high number of options results in lag and user confusion
                let name = data[i].name;
                let displayName = name.split(" ")
                // console.log

                mapDatalist.innerHTML += "<option value="+displayName[0]+","+displayName[1]+"></option>" // Adds the option to the output
            }
            mapIdEntry = data[0].id // Stores the current selection for later use
            getRooms()
        }
    })
})

// Below function is copied from change-timetable.js
// It would be better to have teachers select subjects with a datalist, but it is unnecesary for a MVP.
// Teacher can be trusted to input the correct data.
console.log("")
// var subjectNames = []
// getLessons() // Only needs to be ran once, because it is not dynamic with user input
// function getLessons() {
//     fetch("/api.php", { // Gets the API script
//         method: "POST", // Post is used because it's more private
//         headers: {
//             "Content-Type": "application/json" // Determines the format to be JSON
//         },
//         body: JSON.stringify({request: "allLessons"}) // Requests all lessons from the api 
//     })

//     .then(response => response.json()) // Returns the search response as an object named 'data'
//     .then(data => {
//         if (data.message) { // Checks if there is an error message
//             return;
//         }
//         else {
//             for (let i = 0; i < data.length; i ++) {
//                 subjectNames.push(data[i].lesson_name)
//             }
//             subjectNames = removeDuplicates(subjectNames)

//             subjectDatalist.innerHTML = ""
//             for (let i = 0; i < subjectNames.length; i++) {
//                 subjectDatalist.innerHTML += "<option value="+subjectNames[i]+"></option>" // Adds the option to the output
//             }
//         }
//     })
// }

var roomNames = []
var roomIdEntry
function getRooms() {
    fetch("/api.php", { // Gets the API script
        method: "POST", // Post is used because it's more private
        headers: {
            "Content-Type": "application/json" // Determines the format to be JSON
        },
        body: JSON.stringify({request: "rooms", map_id: mapIdEntry}) // Requests all lessons from the api 
    })

    .then(response => response.json()) // Returns the search response as an object named 'data'
    .then(data => {
        if (data.message) { // Checks if there is an error message
            return;
        }
        else {
            // console.log(data[0].classroom_name)
            for (let i = 0; i < data.length; i ++) {
                roomNames.push(data[i].classroom_name)
            }
            roomNames = removeDuplicates(roomNames)

            classroomDatalist.innerHTML = ""
            for (let i = 0; i < roomNames.length; i++) {
                classroomDatalist.innerHTML += "<option value="+roomNames[i]+"></option>" // Adds the option to the output
            }
            roomIdEntry = data[0].map_id
        }
    })
}

function removeDuplicates(array) {
    const uniqueArray = [...new Set(array)];
    return uniqueArray
}

async function getAccountId(fName, lName) {
    const response = await fetch("/api.php", { // Gets the API script
        method: "POST", // Post is used because it's more private
        headers: {
            "Content-Type": "application/json" // Determines the format to be JSON
        },
        body: JSON.stringify({request: "getAccountId", first_name: fName, last_name: lName}) // Requests account ID from the api 
    })
    const data = await response.json()
    // console.log(data)
    if (data.message) { // Checks if there is an error message
        console.log(data)
        return;
    }
    else {
        return data[0].account_id
    }
}

async function getRoomId(roomName, id) {
    const response = await fetch("/api.php", { // Gets the API script
        method: "POST", // Post is used because it's more private
        headers: {
            "Content-Type": "application/json" // Determines the format to be JSON
        },
        body: JSON.stringify({request: "getRoomId", classroom_name: roomName, map_id: id}) // Requests room ID from the api 
    })
    const data = await response.json()

    if (data.message) { // Checks if there is an error message
        alert("Please insert map name before room name")
        console.log(data)
        return;
    }
    else {
        return data[0].room_id
    }
}

// async function getLessonId(name, teachId, start, day) {
//     try {
//         const response = await fetch("/api.php", { // Gets the API script
//             method: "POST", // Post is used because it's more private
//             headers: {
//                 "Content-Type": "application/json" // Determines the format to be JSON
//             },
//             body: JSON.stringify({request: "getLessonId", module: lessonName.value, teacher_id: teacherId, start_time: startTime, day: day.value}) // Requests lesson ID from the api 
//         })
    
//         data = await response.json()
//     }
//     catch (error) {
//         alert("Lesson does not exits in database. Ask teacher or admin for support, or try inputting data again.")
//         console.log(error)
//         return
//     }
//     if (data.message) { // Checks if there is an error message
//         console.log(data)
//         console.log("ERROR HERE")
//         alert("Lesson does not exits in database. Ask teacher or admin for support, or try inputting data again.")
//         return;
//     }
//     else {
//         return data[0].lesson_id
//     }
// }

async function addToDB() {
    var teacherName = teacherInput.value.split(",")
    var teacherFirstName = teacherName[0]
    var teacherLastName = teacherName[1]

    let teacherId = await getAccountId(teacherFirstName, teacherLastName)
    // let lessonId = await getLessonId(lessonName.value, teacherIdEntry, startTime, day.value)
    let classroomId = await getRoomId(classroomInput.value, roomIdEntry)
    // let roomId = await getRoomId(classroomInput.value, mapIdEntry)

    let startTime = times[module.value-1]
    let endTime = endTimes[module.value-1]

    var input = [lessonName.value, teacherId, startTime, endTime, day.value, classroomId]
    console.log(input)

    fetch("/insert.php", {
        method: "POST",
        body: JSON.stringify({request: "updateLessons", input: input})
    })
    .then(response => response.text())
    .then(text => console.log(text)) // Log success or error message
    .catch(error => console.error("Error:", error));

    // console.log(input)
}