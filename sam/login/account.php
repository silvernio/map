<?php
    header('Content-Type: application/json');

    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!isset($data['token'])) {
        echo json_encode(['message' => 'No token provided.']);
        exit;
    }

    $token = $data['token'];

    if (!isset($data['provider'])) {
        echo json_encode(['message' => 'No provider given.']);
        exit;
    }

    $provider = $data['provider'];

    // Google token

    if ($provider == 'google') {
        $tokenParts = explode('.', $token);

        if (count($tokenParts) != 3) {
            echo json_encode(['message' => 'Invalid Google token provided.']);
            exit;
        }

        // Google token is formatted as Header.Payload.Signature
        // (payload is for info, signature is for verification)

        $payloadToken = $tokenParts[1];

        // Format token for base64 decoding

        $payloadJSON = base64_decode(str_replace(['-', '_'], ['+', '/'], $payloadToken));

        $payload = json_decode($payloadJSON, true); // true makes it an array rather than type 'stdClass'

        // echo json_encode(['message' => $payload]);
        // exit;

        $google_id = $payload['sub'];

        $email = $payload['email'];

        $name = $payload['name'];

        $sql = "SELECT * FROM accounts WHERE account_id = " . $google_id;

        echo json_encode(['message' => 'Hello, ' . $name, 'obj' => $payload]);
    }

    else {
        echo json_encode(['message' => 'Unsupported/unknown provider given.']);
        exit;
    }
?>