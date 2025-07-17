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
    // 取得使用者資訊
    $stmt = $pdo->prepare("SELECT username, name, email FROM users WHERE id=?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => '找不到使用者資訊']);
        exit;
    }
    
    // 取得寵物資訊
    $stmt = $pdo->prepare("SELECT id, name, type, age FROM pets WHERE member_id=?");
    $stmt->execute([$_SESSION['user_id']]);
    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'pets' => $pets
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '系統錯誤']);
}
?>
