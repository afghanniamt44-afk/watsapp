<?php
// ==========================================================
// Database Connection Test Script
// Open: http://localhost/watsapp/api/test_db.php
// ==========================================================

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host    = '127.0.0.1';
$db      = 'watsapp';
$user    = 'root';
$pass    = '';
$charset = 'utf8mb4';

$result = [
    'server'     => 'PHP is running ✅',
    'php_version' => PHP_VERSION,
    'db_status'  => null,
    'db_name'    => $db,
    'tables'     => [],
    'row_counts' => [],
    'errors'     => [],
];

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $result['db_status'] = 'Connected to MySQL ✅';

    // List all tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $result['tables'] = $tables;

    // Row counts
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        $result['row_counts'][$table] = (int)$count;
    }

} catch (PDOException $e) {
    $result['db_status'] = 'MySQL Connection FAILED ❌';
    $result['errors'][]  = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
