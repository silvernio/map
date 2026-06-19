<?php
// Database connection - you can change these values to match your database configuration
//in production do not hardcode these values and use environment variables instead
$lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach($lines as $line) {
    $line = trim($line);

    if (str_starts_with($line, '#')) continue;

    if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            
            $key = trim($key);
            $value = trim($value);

            // Strip optional quotes around the value
            if (preg_match('/^([\'"])(.*)\1$/', $value, $matches)) {
                $value = $matches[2];
            }

            // Register into system environment for getenv()
            putenv("{$key}={$value}");

            // Register into PHP superglobals (optional but recommended)
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
    }
}

$host = getenv('DB_HOST');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$dbname = getenv('DB_NAME');

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["message" => "Database connection failed " . getenv('DB_USERNAME')]));
}
?>