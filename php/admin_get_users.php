<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'db.php';

header('Content-Type: application/json');

// 檢查是否為管理員
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '未登入', 'debug' => 'No user_id in session']);
    exit;
}

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'shop') {
    echo json_encode(['success' => false, 'message' => '權限不足', 'debug' => [
        'user_id' => $_SESSION['user_id'] ?? 'not set',
        'role' => $_SESSION['role'] ?? 'not set',
        'expected_role' => 'shop'
    ]]);
    exit;
}

try {
    // 取得所有有訊息的使用者
    $stmt = $pdo->prepare("
        SELECT DISTINCT u.id, u.name, u.email, u.username,
               (SELECT COUNT(*) FROM messages m2 WHERE m2.user_id = u.id AND m2.sender = 'user' AND m2.is_read = 0) as unread_count,
               (SELECT MAX(m3.created_at) FROM messages m3 WHERE m3.user_id = u.id) as last_message_time
        FROM users u 
        INNER JOIN messages m ON u.id = m.user_id 
        WHERE u.role = 'user' OR u.role IS NULL
        ORDER BY last_message_time DESC
    ");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'users' => $users
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '系統錯誤']);
}
?>
