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

    // Insert Requests

    if ($request == 'map' && isset($data['map_name']) && isset($data['map_rooms'])) {
        // first, insert a new map
        $sql = "INSERT INTO `maps` (`id`, `name`, `image_path`) VALUES (NULL, '" . $data['map_name'] . "', '/');";
        $conn->query($sql);

        $map_id = $conn->insert_id;
    
        foreach ($data['map_rooms'] as $room) {
            $sql = "INSERT INTO `rooms` (`room_id`, `room_name`, `points`, `map_id`) VALUES (NULL, '" . $room['name'] . "', '" . $room['points'] . "', '" . $map_id . "');";
            $conn->query($sql);
        }

        echo json_encode(["message" => "Map and rooms created successfully!", "map_id" => $map_id]);
    }

    else if ($request == 'map_update' && isset($data['map_id']) && isset($data['map_name']) && isset($data['map_rooms'])) {
        $sql = "UPDATE `maps` SET name = '" . $data['map_name'] . "' WHERE id = " . $data['map_id'];
        $conn->query($sql);

        $sql = "DELETE FROM rooms WHERE map_id = " . $data['map_id'];
        $conn->query($sql);

         foreach ($data['map_rooms'] as $room) {
            $sql = "INSERT INTO `rooms` (`room_id`, `room_name`, `points`, `map_id`) VALUES (NULL, '" . $room['name'] . "', '" . $room['points'] . "', '" . $data['map_id'] . "');";
            $conn->query($sql);
        }

        echo json_encode(["message" => "Map and rooms updated successfully!"]);
    }

    else if ($request == 'map_delete' && isset($data['map_id'])) {
        $sql = "DELETE FROM rooms WHERE map_id = " . $data['map_id'];
        $conn->query($sql);
    
        $sql = "DELETE FROM `maps` WHERE id = " . $data['map_id'];
        $conn->query($sql);

        echo json_encode(["message" => "Map and rooms deleted successfully!"]);
    }

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

    else {
        echo json_encode(['message' => 'Invalid request']);
        $conn->close();
        exit;
    }

    $conn->close();
?>