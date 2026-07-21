
<?php 
include "./connect.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$request = $data["request"] ?? "";

if ($request === "subjects") {
    $result = $conn->query("SELECT * FROM subjects ORDER BY subject_name");
    $subjects = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $subjects[] = $row;
        }
    }
    echo json_encode($subjects); // plain array, matches your JS's for-loop
    exit;
}

if ($request === "addEquipment") {
    $listName = $data["Listname"] ?? "";
    $items    = $data["items"] ?? [];

    if ($listName === "" || !is_array($items) || count($items) === 0) {
        echo json_encode(["success" => false, "error" => "Missing subject or items."]);
        exit;
    }

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

echo json_encode(["success" => false, "error" => "Unknown request"]);