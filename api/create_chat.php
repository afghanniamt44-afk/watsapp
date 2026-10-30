<?php
require_once __DIR__ . '/db.php';

try {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data || !isset($data['name'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing contact or group name']);
        exit();
    }

    $id = $data['id'] ?? ((!empty($data['is_group']) ? 'group-' : 'contact-') . round(microtime(true) * 1000));
    $name = $data['name'];
    $avatar = $data['avatar'] ?? null;
    $isGroup = !empty($data['is_group']) ? 1 : 0;
    $about = $data['about'] ?? ($isGroup ? 'Group Chat' : 'Available');
    $members = $data['members'] ?? null;
    $phone = $data['phone'] ?? null;
    $status = $data['status'] ?? 'online';
    $lastSeen = $data['last_seen'] ?? 'online';

    // 1. Insert into chats
    $stmt = $pdo->prepare("
        INSERT INTO chats (id, name, avatar, is_group, about, members, phone, status, last_seen, pinned, unread_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
        ON DUPLICATE KEY UPDATE name = VALUES(name), avatar = VALUES(avatar), about = VALUES(about)
    ");
    $stmt->execute([$id, $name, $avatar, $isGroup, $about, $members, $phone, $status, $lastSeen]);

    // 2. If contact, also insert into contacts table
    if (!$isGroup) {
        $contactStmt = $pdo->prepare("
            INSERT INTO contacts (id, name, phone, avatar, about, is_group)
            VALUES (?, ?, ?, ?, ?, 0)
            ON DUPLICATE KEY UPDATE name = VALUES(name), avatar = VALUES(avatar)
        ");
        $contactStmt->execute([$id, $name, $phone, $avatar, $about]);
    }

    echo json_encode([
        'status' => 'success',
        'chat' => [
            'id' => $id,
            'name' => $name,
            'avatar' => $avatar,
            'isGroup' => (bool)$isGroup,
            'about' => $about,
            'members' => $members,
            'phone' => $phone,
            'status' => $status,
            'lastSeen' => $lastSeen,
            'pinned' => false,
            'unreadCount' => 0,
            'messages' => []
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
