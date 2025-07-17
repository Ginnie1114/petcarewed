<?php
// filepath: /Applications/XAMPP/xamppfiles/htdocs/FunSafe拷貝/get_member.php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => '未登入']);
    exit;
}

$stmt = $pdo->prepare("SELECT username, name, email FROM users WHERE id=?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// 查詢未讀訊息數
$stmt2 = $pdo->prepare("SELECT COUNT(*) FROM messages WHERE user_id=? AND sender='shop' AND is_read=0");
$stmt2->execute([$_SESSION['user_id']]);
$unread = $stmt2->fetchColumn();

header('Content-Type: application/json');
echo json_encode([
    'user' => $user,
    'unread_messages' => (int)$unread
]);
?>