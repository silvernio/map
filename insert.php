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
            $sql = "INSERT INTO `rooms` (`room_id`, `name`, `points`, `map_id`) VALUES (NULL, '" . $room['name'] . "', '" . $room['points'] . "', '" . $map_id . "');";
            $conn->query($sql);
        }

        echo json_encode(["message" => "Map and rooms created successfully!"]);
    }
    else {
        echo json_encode(['message' => 'Invalid request']);
        $conn->close();
        exit;
    }

    $conn->close();
?>