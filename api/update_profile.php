<?php
require_once __DIR__ . '/db.php';

try {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No data received']);
        exit();
    }

    $name = $data['name'] ?? null;
    $about = $data['about'] ?? null;
    $avatar = $data['avatar'] ?? null;
    $phone = $data['phone'] ?? null;

    $fields = [];
    $values = [];

    if ($name !== null) {
        $fields[] = 'name = ?';
        $values[] = $name;
    }
    if ($about !== null) {
        $fields[] = 'about = ?';
        $values[] = $about;
    }
    if ($avatar !== null) {
        $fields[] = 'avatar = ?';
        $values[] = $avatar;
    }
    if ($phone !== null) {
        $fields[] = 'phone = ?';
        $values[] = $phone;
    }

    if (!empty($fields)) {
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = 'me'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
    }

    $userStmt = $pdo->query("SELECT * FROM users WHERE id = 'me' LIMIT 1");
    $currentUser = $userStmt->fetch();

    echo json_encode([
        'status' => 'success',
        'currentUser' => $currentUser
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
