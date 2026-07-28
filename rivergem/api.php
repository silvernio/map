
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


//equipment add
else if ($request === "getequipment") {

$result = $conn->query("SELECT subjects.subject_name,subjects.subject_year,equipment.item_name FROM subjects LEFT JOIN equipment ON subjects.subject_id=equipment.subject_id");
    $subjects = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $subjects[] = $row;
        }
    }
    echo json_encode($subjects); // plain array, matches your JS's for-loop
    exit;
   
} 
    
    



echo json_encode(["success" => false, "error" => "Unknown request"]); 
//show added data on the