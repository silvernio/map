<?php
    header('Content-Type: application/json');

    if (!isset($_COOKIE['profile'])) {
        echo json_encode(['message' => 'Not logged in!']);
        exit;
    }

    $profile = json_decode($_COOKIE['profile'], true);

    // echo json_encode(['profile' => $profile]);
    // exit;

    $account = $profile['account'];

    

    echo json_encode([
        'first_name' => $account['first_name'],
        'last_name' => $account['last_name'],
        'is_teacher' => $account['is_teacher'],
        'picture' => $profile['picture']
    ]);
?>