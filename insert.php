<?php
    header('Content-Type: application/json');

    include 'connect.php';

    $raw = file_get_contents("php://input");
    // Get the raw POST data and decode it as JSON
    $data = json_decode($raw, true);

   error_log("RAW DATA: " . print_r($data, true));

    if (!isset($data['request'])) {
        echo json_encode(['message' => 'No request given']);
        exit;
    }
    
    $request = $data['request'];

    // Insert Requests
if ($request === "addEquipment") {
    $listName = $data["ListName"] ?? "";
    $items = $data["items"] ?? []; 
    

    // if ($listName === "" || !is_array($items) || count($items) === 0) {
    //     echo json_encode(["success" => false, "error" => "Missing subject or items."]);
    //     exit;
    // }
   
    $listName = intval($listName);  
    
    

    $stmt = $conn->prepare("SELECT subject_id FROM subjects WHERE subject_id = ?");
    $stmt->bind_param("i", $listName);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!($row = $result->fetch_assoc())) {
        echo json_encode(["success" => false, "error" => "Subject not found."]);
        exit;
    }

    $subjectId = $row["subject_id"];
    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO equipment (item_name, subject_id) VALUES (?, ?)");
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => $conn->error]);
        exit;
    }

    foreach ($items as $item) {
        $item = trim($item);
        if ($item !== "") {
            $stmt->bind_param("si", $item, $subjectId);
            $stmt->execute();
        }
    }  

   
    

    $stmt->close();

    echo json_encode(["success" => true]);
    exit;
}

    // given a map name, and rooms, insert a new map
    if ($request == 'map' && isset($data['map_name']) && isset($data['map_rooms'])) {
        // first, insert a new map
        $sql = "INSERT INTO `maps` (`id`, `name`, `image_path`) VALUES (NULL, '" . $data['map_name'] . "', '/');";
        $conn->query($sql);

        // get it's row id
        $map_id = $conn->insert_id;

        // now, using the map id, create and link all new rooms
        foreach ($data['map_rooms'] as $room) {
            $sql = "INSERT INTO `rooms` (`room_id`, `room_name`, `points`, `map_id`) VALUES (NULL, '" . $room['name'] . "', '" . $room['points'] . "', '" . $map_id . "');";
            $conn->query($sql);
        }

        // return sucess
        echo json_encode(["message" => "Map and rooms created successfully!", "map_id" => $map_id]);
    }

    // given a map id, and it's new name, and new rooms, update it's data
    else if ($request == 'map_update' && isset($data['map_id']) && isset($data['map_name']) && isset($data['map_rooms'])) {
        // update map name
        $sql = "UPDATE `maps` SET name = '" . $data['map_name'] . "' WHERE id = " . $data['map_id'];
        $conn->query($sql);

        // delete all rooms from the map in the database
        $sql = "DELETE FROM rooms WHERE map_id = " . $data['map_id'];
        $conn->query($sql);


        // replace with new rooms
         foreach ($data['map_rooms'] as $room) {
            $sql = "INSERT INTO `rooms` (`room_id`, `room_name`, `points`, `map_id`) VALUES (NULL, '" . $room['name'] . "', '" . $room['points'] . "', '" . $data['map_id'] . "');";
            $conn->query($sql);
        }

        // return success
        echo json_encode(["message" => "Map and rooms updated successfully!"]);
    }

    // given a map id, delete the map
    else if ($request == 'map_delete' && isset($data['map_id'])) {
        // delete all room rows using the map id
        $sql = "DELETE FROM rooms WHERE map_id = " . $data['map_id'];
        $conn->query($sql);

        // delete the map row using the map id
        $sql = "DELETE FROM `maps` WHERE id = " . $data['map_id'];
        $conn->query($sql);

        // return success
        echo json_encode(["message" => "Map and rooms deleted successfully!"]);
    }

    // Insertions for data input page(s) start here:
    else if ($request == 'updateTimetable' && isset($data['input'])) {
        $input = $data["input"];

        $update = $conn->prepare("INSERT INTO attendance (student_id, lesson_id) VALUES (?, ?)");
        $update->bind_param("si", $input[0], $input[1]);

        $success = $update->execute();
        if (!$success) {
            echo json_encode(['message' => 'Data failed to insert']);
        }
        $update->close();
        echo json_encode([ // Return a success message to the console as JSON, as well as info for debugging
            "message" => "Data successfully inserted",
        ]);
    }
    else if ($request == 'updateLessons' && isset($data['input'])) {
        $input = $data["input"];

        $update = $conn->prepare("INSERT INTO lessons (lesson_name, teacher_id, start_time, finish_time, day, room_id) VALUES (?, ?, ?, ?, ?, ?)");
        $update->bind_param("sssssi", $input[0], $input[1], $input[2], $input[3], $input[4], $input[5]);

        $success = $update->execute();
        if (!$success) {
            echo json_encode(['message' => 'Data failed to insert']);
        }
        $update->close();
        echo json_encode([ // Return a success message to the console as JSON, as well as info for debugging
            "message" => "Data successfully inserted",
        ]);
    }
    // Insertions for data input page(s) end here:

    else {
        echo json_encode(['message' => 'Invalid request']);
        $conn->close();
        exit;
    }
     
    $conn->close();
?>