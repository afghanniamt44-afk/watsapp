<?php
require_once __DIR__ . '/db.php';

$uploadDir = dirname(__DIR__) . '/uploads/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No file uploaded']);
    exit();
}

$file = $_FILES['file'];
$fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', basename($file['name']));
$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $url = '/uploads/' . $fileName;
    echo json_encode([
        'status' => 'success',
        'url' => $url,
        'fileName' => $file['name'],
        'fileSize' => $file['size']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save file on server']);
}
