<?php
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$response = [
    'loggedIn' => false,
    'name' => '',
    'role' => '',
    'unread_messages' => 0
];

if (isset($_SESSION['user_id'])) {
    require_once '../db.php';
    $response['loggedIn'] = true;
    $response['name'] = $_SESSION['name'];
    $response['role'] = $_SESSION['role'] ?? 'user';

    // 順便取得未讀訊息數
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND sender = 'merchant' AND is_read = 0");
    $stmt->execute([$_SESSION['user_id']]);
    $result = $stmt->fetch();
    $response['unread_messages'] = $result['count'] ?? 0;
}

echo json_encode($response);
?>
