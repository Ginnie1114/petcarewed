<?php
require_once 'session_check.php';
require_once '../db.php';

$user_id = $_SESSION['user_id'];

// 將來自商家的未讀訊息設為已讀
$stmt = $pdo->prepare("UPDATE messages SET is_read = 1 WHERE user_id = ? AND sender = 'merchant' AND is_read = 0");
$stmt->execute([$user_id]);

// 取得該使用者的所有訊息
$stmt = $pdo->prepare("SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC");
$stmt->execute([$user_id]);
$messages = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'messages' => $messages
]);
?>
