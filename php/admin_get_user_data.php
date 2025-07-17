<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'db.php';

header('Content-Type: application/json');

// 檢查是否為管理員
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'shop') {
    echo json_encode(['success' => false, 'message' => '權限不足']);
    exit;
}

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => '缺少用戶ID']);
    exit;
}

try {
    // 取得用戶資訊
    $stmt = $pdo->prepare("SELECT id, name, email, username FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => '找不到用戶']);
        exit;
    }
    
    // 取得用戶寵物
    $stmt = $pdo->prepare("SELECT id, name, type, age FROM pets WHERE member_id = ?");
    $stmt->execute([$user_id]);
    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 取得對話記錄
    $stmt = $pdo->prepare("
        SELECT m.*, p.name as pet_name 
        FROM messages m 
        LEFT JOIN pets p ON m.pet_id = p.id 
        WHERE m.user_id = ? 
        ORDER BY m.created_at ASC
    ");
    $stmt->execute([$user_id]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 標記訊息為已讀
    $stmt = $pdo->prepare("UPDATE messages SET is_read = 1 WHERE user_id = ? AND sender = 'user' AND is_read = 0");
    $stmt->execute([$user_id]);
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'pets' => $pets,
        'messages' => $messages
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '系統錯誤']);
}
?>
