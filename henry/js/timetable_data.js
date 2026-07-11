var lessons = []

// getData()

// async function getData() {
//     var studentIds = await getAllStudents()
//     await getLessons(studentIds)
// }

async function getAllStudents() {
    var studentIds = []

    const response = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: 'students'})  // Send a request to get crash type data
    })

    const data = await response.json()
    
    if (data.message) {
        console.log(data)
    }
    else {
        for (let i = 0; i < data.length; i++) {
            studentIds.push(data[i].student_id)
        }
    }

    return studentIds
}

async function getLessons(studentIds) {
    // Put this in a FOR loop later
    const response = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: 'lessons', student_id: studentIds[0]})  // Send a request to get data for the FIRST STUDENT IN THE DB
    })

    const data = await response.json()
    
    if (data.message) {
        console.log(data)
    }
    else {
        for (i = 0; i < data.length; i++) {
            var teacherName = await getLessonTeacher(data[i].teacher_id)
            lessons.push([data[i].lesson_name, data[i].start_time, data[i].finish_time, teacherName])            
        }
    }
    // console.log(lessons)
}

async function getLessonTeacher(teacherIds) {
    const response = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({request: 'teacher', teacher_id: teacherIds[0]})  // Send a request to get data for the FIRST STUDENT IN THE DB
    })

    const data = await response.json()
    
    if (data.message) {
        console.log(data)
    }
    else {
        return data[0].teacher_first_name + " " + data[0].teacher_last_name
    }
}