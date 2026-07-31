const allHTML = document.getElementById("everything")
allHTML.remove()
main()

// This function includes the entire script, because everything must wait for the document to be appended if it is to work
async function main() {
    var account
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
console.log(teacherInput)
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
                let splitName = name.split(" ")
                var displayName = ""
                for (let i = 0; i < splitName.length; i++) {
                    displayName += splitName[i]
                    if (i < splitName.length - 1) {
                        displayName += ","
                    }
                }
                // console.log

                mapDatalist.innerHTML += "<option value="+displayName+"></option>" // Adds the option to the output
            }
            mapIdEntry = data[0].id // Stores the current selection for later use
            // getRooms()
        }
    })
    console.log(mapIdEntry)
})

var roomNames = []
var roomIdEntry
// function getRooms() {
//     fetch("/api.php", { // Gets the API script
//         method: "POST", // Post is used because it's more private
//         headers: {
//             "Content-Type": "application/json" // Determines the format to be JSON
//         },
//         body: JSON.stringify({request: "rooms", map_id: mapIdEntry}) // Requests all lessons from the api 
//     })

//     .then(response => response.json()) // Returns the search response as an object named 'data'
//     .then(data => {
//         if (data.message) { // Checks if there is an error message
//             return;
//         }
//         else {
//             console.log(data)
//             // console.log(data[0].classroom_name)
//             for (let i = 0; i < data.length; i ++) {
//                 roomNames.push(data[i].room_name)
//             }
//             roomNames = removeDuplicates(roomNames)

//             classroomDatalist.innerHTML = ""
//             for (let i = 0; i < roomNames.length; i++) {
//                 classroomDatalist.innerHTML += "<option value="+roomNames[i]+"></option>" // Adds the option to the output
//             }
//             roomIdEntry = data[0].map_id
//         }
//     })
// }
console.log("mmmmmm production, the most delicious")
var mapIdEntry // Output of the function below
classroomInput.addEventListener("input", function() { // Activates whenever the user types in the searchbox for locations
    let search = classroomInput.value // User input

    fetch("/api.php", { // Gets the API script
        method: "POST", // Post is used because it's more private
        headers: {
            "Content-Type": "application/json" // Determines the format to be JSON
        },
        body: JSON.stringify({request: "rooms", map_id: mapIdEntry, search: search}) // Requests all lessons from the api 
    })

    .then(response => response.json()) // Returns the search response as an object named 'data'
    .then(data => {
        if (data.message) { // Checks if there is an error message
            return;
        }
        else {
            console.log(data)
            // console.log(data[0].classroom_name)
            for (let i = 0; i < data.length; i ++) {
                roomNames.push(data[i].room_name)
            }
            roomNames = removeDuplicates(roomNames)
            console.log(roomNames)
            classroomDatalist.innerHTML = ""
            for (let i = 0; i < roomNames.length; i++) {
                classroomDatalist.innerHTML += "<option value="+roomNames[i]+"></option>" // Adds the option to the output
            }
            roomIdEntry = data[0].map_id
        }
    })
})

// Runs in 'getRooms'. Probably unnecesary
function removeDuplicates(array) {
    const uniqueArray = [...new Set(array)];
    return uniqueArray
}

// Runs in 'addToDB'
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
        alert("Error: account not saved")
        console.log(data)
        return;
    }
    else {
        return data[0].account_id // Returns account ID
    }
}

// Runs in 'addToDB'
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
        return data[0].room_id // Returns room ID
    }
}

// FLAWS:
// Teachers may have names which don't fit into a first name/last name format. e.g, more than two names.
// It is cleanest to input data into 'map' first and everything else second, but users may not know this.
async function addToDB() {
    var teacherName = teacherInput.value.split(",") // First name and last name must be seperated because they are stored seperately in the DB
    var teacherFirstName = teacherName[0]
    var teacherLastName = teacherName[1]

    // Functions here for organization. They parse in the data which is neccesary to search for the ID in the appropriate table.
    let teacherId = await getAccountId(teacherFirstName, teacherLastName)
    let classroomId = await getRoomId(classroomInput.value, roomIdEntry)

    // The DB records start and end time seperately, so they both have to be inserted
    let startTime = times[module.value-1]
    let endTime = endTimes[module.value-1]

    // Store all inputs in a single array for organization
    var input = [lessonName.value, teacherId, startTime, endTime, day.value, classroomId]

    fetch("/insert.php", { // Get insertion file
        method: "POST",
        body: JSON.stringify({request: "updateLessons", input: input}) // Could just say 'input' instead of 'input: input' but this makes more sense to me.
    })
    .then(response => response.json()) // Output response so an error/success message can be sent. Is not neccesary for data insertion.
    .then(text => {
        errors = text
    })
    // Success/fail messages are present to prevent users from inserting into the db multiple times.
    if (errors.message == `Data successfully inserted`) {
        alert("Lesson added!")
    }
    else {
        alert("Lesson failed to be added.")
    }
}
}