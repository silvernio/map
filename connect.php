<?php
// Database connection - you can change these values to match your database configuration
//in production do not hardcode these values and use environment variables instead
$host = "localhost";
$username = "root";
$password = "";
$dbname = "crashes_db";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["message" => "Database connection failed"]));
}
?>