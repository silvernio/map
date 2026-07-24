<?php
    header('Content-Type: application/json');

    include 'connect.php';

    $raw = file_get_contents("php://input");
    // Get the raw POST data and decode it as JSON
    $data = json_decode($raw, true);

    if (!isset($data['request'])) {
        echo json_encode(['message' => 'No request given']);
        exit;
    }
    
    $request = $data['request'];

    // Requests

    if ($request == 'students') {
        $sql = "SELECT * FROM accounts WHERE is_teacher = 0";
    }

    else if ($request == 'maps') {
        $sql = "SELECT * FROM maps";
    }

    else if ($request == 'lessons' && isset($data['student_id'])) {
        $student_id = $data['student_id'];

        $sql = "SELECT * FROM attendance INNER JOIN lessons ON attendance.lesson_id = lessons.lesson_id WHERE student_id = " . $student_id;
    }

    else if ($request == 'rooms' && isset($data['map_id'])) {
        $map_id = $data['map_id'];
        $sql = "SELECT * FROM rooms WHERE map_id = " . $map_id;
    }

    else if ($request == 'teacher' && isset($data['teacher_id'])) {
        $teacher_id = $data['teacher_id'];
        $sql = "SELECT * FROM accounts WHERE account_id = " . $teacher_id;
    }

    // Searches for data input page(s):
    else if($request == "searchAccounts"){ // Searches the location with 'LIKE' commands
        if(isset($data["search"])){ // Check to see if value sent is set

            // Escape the search value to prevent SQL injection using db connection's real_escape_string method
            $search = $conn->real_escape_string($data["search"]);

            // Searches the DB for search value
            $sql = "SELECT * FROM accounts WHERE first_name LIKE '%$search%' OR last_name LIKE '%$search%'";
        }
        else{ // If no value is set
            echo json_encode(["message" => "Invalid request"]);
            exit;
        }
    }

    else if ($request == 'allLessons') {
        $sql = "SELECT * FROM lessons";
    }

    else if ($request == 'getAccountId') {
        $first_name = $conn->real_escape_string($data["first_name"]);
        $last_name = $conn->real_escape_string($data["last_name"]);

        $sql = "SELECT account_id FROM accounts WHERE first_name = '" . $first_name . "' AND last_name = '" . $last_name . "'";
    }

    else if($request == 'getLessonId') {
        $lesson_name = $conn->real_escape_string($data["module"]);
        $teacher_id = $conn->real_escape_string($data["teacher_id"]);
        $start_time = $conn->real_escape_string($data["start_time"]);
        $day = $conn->real_escape_string($data["day"]);

        $sql = "SELECT lesson_id FROM lessons WHERE lesson_name = '" . $lesson_name . "' AND teacher_id = '" . $teacher_id . "' AND start_time = '" . $start_time . "' AND day = '" . $day . "'";
    }

    else {
        echo json_encode(['message' => 'Invalid request']);
        exit;
    }

    $result = $conn->query($sql);

    //check if there are results
    if ($result && $result->num_rows > 0) {
        // Loop through the results storing them in an array to be returned as JSON
        $crashes = [];
        while ($row = $result->fetch_assoc()) {
            $crashes[] = $row; // Add each row to the crashes array
        }
        // Return the results as JSON back to fetch in the frontend
        echo json_encode($crashes);
    } else {
        echo json_encode(["message" => "No data found"]);
    }
    //close the database connection
    $conn->close();
?>