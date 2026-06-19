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

    if ($request == 'students') {
        $sql = "SELECT * FROM students";
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