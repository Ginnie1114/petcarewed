<?php
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['unread_count' => 0]);
    exit;
}

require_once '../db.php'; // 注意路徑是 ../db.php

$stmt = $pdo->prepare("SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND sender = 'merchant' AND is_read = 0");
$stmt->execute([$_SESSION['user_id']]);
$result = $stmt->fetch();

echo json_encode(['unread_count' => $result['count'] ?? 0]);
?>
