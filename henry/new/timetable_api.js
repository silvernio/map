var lessons = []

// Functions are async because data is not fetched instantly. This is also why every other function in the project must be async.
export async function getLessons(studentIds) {
    var account
    account = await getAccount()
    const accountResponse = await fetch("/api.php", {
    method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: 'getAccountId', first_name: account.first_name, last_name: account.last_name})  // Send a request to get data for the FIRST STUDENT IN THE DB (CHANGE LATER)
    })

    const accountData = await accountResponse.json()
    let id = accountData[0].account_id

    const response = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: 'lessons', student_id: id})  // Send a request to get data for the FIRST STUDENT IN THE DB (CHANGE LATER)
    })

    const data = await response.json()

    let lessons = []
    
    if (data.message) {
        console.log(data)
    }
    else {
        for (let i = 0; i < data.length; i++) {
            var teacherName = await getLessonTeacher(data[i].teacher_id)
            lessons.push([data[i].lesson_name, data[i].start_time, data[i].finish_time, teacherName, data[i].room_name, data[i].room_id]) // Outputs relevant info for timetable
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
        // console.log(data)
    }
    else {
        return data[0].first_name + " " + data[0].last_name // Outputs the teacher name
    }
}