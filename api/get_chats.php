<?php
require_once __DIR__ . '/db.php';

try {
    // 1. Fetch current user
    $userStmt = $pdo->query("SELECT * FROM users WHERE id = 'me' LIMIT 1");
    $currentUser = $userStmt->fetch();

    // 2. Fetch all chats
    $chatsStmt = $pdo->query("SELECT * FROM chats ORDER BY pinned DESC, updated_at DESC");
    $chats = $chatsStmt->fetchAll();

    // 3. Attach messages for each chat
    foreach ($chats as &$chat) {
        $chat['isGroup'] = (bool)$chat['is_group'];
        $chat['pinned'] = (bool)$chat['pinned'];
        $chat['unreadCount'] = (int)$chat['unread_count'];

        $msgStmt = $pdo->prepare("SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC");
        $msgStmt->execute([$chat['id']]);
        $messages = $msgStmt->fetchAll();

        foreach ($messages as &$msg) {
            $msg['senderId'] = $msg['sender_id'];
            $msg['senderName'] = $msg['sender_name'];
            $msg['mediaUrl'] = $msg['media_url'];
            $msg['fileName'] = $msg['file_name'];
            $msg['fileSize'] = $msg['file_size'];
            $msg['replyToId'] = $msg['reply_to_id'];
        }

        $chat['messages'] = $messages;
    }

    // 4. Fetch statuses
    $statusStmt = $pdo->query("SELECT * FROM statuses ORDER BY created_at DESC");
    $statuses = $statusStmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'currentUser' => $currentUser,
        'chats' => $chats,
        'statuses' => $statuses
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
