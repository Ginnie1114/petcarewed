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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = filter_input(INPUT_POST, 'user_id', FILTER_VALIDATE_INT);
    $content = filter_input(INPUT_POST, 'content', FILTER_SANITIZE_STRING);

    if (!$user_id || empty($content)) {
        echo json_encode(['success' => false, 'message' => '缺少必要參數']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO messages (user_id, sender, content, created_at) VALUES (?, 'merchant', ?, NOW())");
        $stmt->execute([$user_id, $content]);
        
        echo json_encode(['success' => true, 'message' => '回覆已送出']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => '系統錯誤']);
    }
} else {
    echo json_encode(['success' => false, 'message' => '錯誤的請求方式']);
}
?>
