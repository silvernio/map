var lessons = []

// Functions are async because data is not fetched instantly. This is also why every other function in the project must be async.
export async function getAllStudents() {
    var studentIds = [] // Where the output of the function is stored

    const response = await fetch("/api.php", {
        method: "POST", // POST allows parameters to be put in the request
        headers: {
            "Content-Type": "application/json" // Type is JSON because that's how it is in the API
        },
        body: JSON.stringify({request: 'students'})  // Send a request to get student data
    })

    const data = await response.json() // Save the output of the request as 'data'
    
    if (data.message) { // If request failed
        console.log(data)
    }
    else {
        for (let i = 0; i < data.length; i++) {
            studentIds.push(data[i].account_id) // Adds Ids to the function output
        }
    }

    return studentIds
}

export async function getLessons(studentIds) {
    // Put this in a FOR loop later, so it's not just the first student being checked
    const response = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: 'lessons', student_id: studentIds[0]})  // Send a request to get data for the FIRST STUDENT IN THE DB (CHANGE LATER)
    })

    const data = await response.json()

    let lessons = []
    
    if (data.message) {
        console.log(data)
    }
    else {
        for (i = 0; i < data.length; i++) {
            var teacherName = await getLessonTeacher(data[i].teacher_id)
            lessons.push([data[i].lesson_name, data[i].start_time, data[i].finish_time, teacherName]) // Outputs relevant info for timetable
        }
    }

    return lessons;
}

async function getLessonTeacher(teacherIds) {
    const response = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: 'teacher', teacher_id: teacherIds})  // Send a request to get data for the lesson teachers
    })

    const data = await response.json()
    
    if (data.message) {
        console.log(data)
    }
    else {
        console.log(data)
        return data[0].first_name + " " + data[0].last_name // Outputs the teacher name
    }
}