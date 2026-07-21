    
 /*
include "../connect.php";


header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    // Read the JSON body sent by fetch()
    $data = json_decode(file_get_contents("php://input"), true);

    $listName = trim($data["listName"] ?? "");
    $items    = $data["items"] ?? [];

    if ($listName === "" || !is_array($items) || count($items) === 0) {
        echo json_encode(["success" => false, "error" => "Missing list name or items."]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO equipment (item_name, equipment_list) VALUES (?, ?)");
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => $conn->error]);
        exit;
    }

    foreach ($items as $item) {
        $item = trim($item);
        if ($item !== "") {
            $stmt->bind_param("ss", $item, $listName);
            $stmt->execute();
        }
    }
    $stmt->close();

    echo json_encode(["success" => true]);
    exit;
}

if ($method === "subject_id") {
    // Return all current rows so the page can display them
    $result = $conn->query(
        "SELECT equipment_id, item_name, equipment_list FROM equipment ORDER BY equipment_list, equipment_id"
    );

    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }

    echo json_encode(["success" => true, "rows" => $rows]);
    exit;
}

// Any other method
http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);