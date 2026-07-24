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
        // $crashes = $conn->prepare("INSERT INTO attendance (location_id, units, casualties, fatalities, serious_injuries, mild_injuries, year, month, day, time, area_speed, crash_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    }

    else {
        echo json_encode(['message' => 'Invalid request']);
        $conn->close();
        exit;
    }

    $conn->close();
?>