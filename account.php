<?php
    header('Content-Type: application/json');

    include 'connect.php';

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

        $first_name = $payload['given_name'];

        $last_name = $payload['family_name'];

        $picture = $payload['picture'];

        $is_admin = false;

        $is_admin_int = (int)$is_admin;

        $sql = "SELECT * FROM accounts WHERE account_id = " . $google_id;

        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $account = $result->fetch_assoc(); // fetch the first row of the result

            $profile = ['account' => $account, 'picture' => $picture];
            
            setcookie('profile', json_encode($profile), time() + 3600, '/');

            $profile['message'] = 'Successfully logged in!';

            echo json_encode($profile);
            exit;
        }
        // Else, insert new account
        $stmt = $conn->prepare("INSERT INTO accounts (account_id, first_name, last_name, email, is_teacher) VALUES (?, ?, ?, ?, ?)");

        $stmt->bind_param('ssssi', $google_id, $first_name, $last_name, $email, $is_admin_int);

        $success = $stmt->execute();

        if (!$success) {
            echo json_encode(['message' => 'Error creating account for ' . $name]);
            $stmt->close();
            $conn->close();
            exit;
        }

        $stmt->close();
        $conn->close();

        $account = ['account_id' => $google_id, 'first_name' => $first_name, 'last_name' => $last_name, 'email' => $email, 'is_teacher' => $is_admin_int];

        $profile = ['account' => $account, 'picture' => $picture];

        setcookie('profile', json_encode($profile), time() + 3600, '/');

        $profile['message'] = 'Successfully signed up!';

        echo json_encode($profile);
    }

    else {
        echo json_encode(['message' => 'Unsupported/unknown provider given.']);
        exit;
    }
?>