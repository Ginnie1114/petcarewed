<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '未登入']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];
    
    // 將來自商家的未讀訊息設為已讀
    $stmt = $pdo->prepare("UPDATE messages SET is_read = 1 WHERE user_id = ? AND sender = 'merchant' AND is_read = 0");
    $stmt->execute([$user_id]);
    
    // 取得該使用者的所有訊息，包含寵物名稱
    $stmt = $pdo->prepare("
        SELECT m.*, p.name as pet_name 
        FROM messages m 
        LEFT JOIN pets p ON m.pet_id = p.id 
        WHERE m.user_id = ? 
        ORDER BY m.created_at ASC
    ");
    $stmt->execute([$user_id]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'messages' => $messages
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '系統錯誤']);
}
?>
