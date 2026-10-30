<?php
require_once __DIR__ . '/db.php';

try {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data || !isset($data['chat_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing chat_id or invalid payload']);
        exit();
    }

    $id = $data['id'] ?? ('msg-' . round(microtime(true) * 1000));
    $chatId = $data['chat_id'];
    $senderId = $data['sender_id'] ?? 'me';
    $senderName = $data['sender_name'] ?? 'You';
    $type = $data['type'] ?? 'text';
    $text = $data['text'] ?? null;
    $mediaUrl = $data['media_url'] ?? null;
    $fileName = $data['file_name'] ?? null;
    $fileSize = $data['file_size'] ?? null;
    $duration = $data['duration'] ?? null;
    $caption = $data['caption'] ?? null;
    $status = $data['status'] ?? 'read';
    $reaction = $data['reaction'] ?? null;
    $replyToId = $data['reply_to_id'] ?? null;
    $timestamp = $data['timestamp'] ?? date('h:i A');
    $date = $data['date'] ?? 'Today';

    $stmt = $pdo->prepare("
        INSERT INTO messages 
        (id, chat_id, sender_id, sender_name, type, text, media_url, file_name, file_size, duration, caption, status, reaction, reply_to_id, timestamp, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $id, $chatId, $senderId, $senderName, $type, $text, $mediaUrl, $fileName, $fileSize, $duration, $caption, $status, $reaction, $replyToId, $timestamp, $date
    ]);

    // Update chats table updated_at
    $updateStmt = $pdo->prepare("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $updateStmt->execute([$chatId]);

    echo json_encode([
        'status' => 'success',
        'message' => [
            'id' => $id,
            'chatId' => $chatId,
            'senderId' => $senderId,
            'senderName' => $senderName,
            'type' => $type,
            'text' => $text,
            'mediaUrl' => $mediaUrl,
            'fileName' => $fileName,
            'fileSize' => $fileSize,
            'duration' => $duration,
            'caption' => $caption,
            'status' => $status,
            'reaction' => $reaction,
            'timestamp' => $timestamp,
            'date' => $date
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
