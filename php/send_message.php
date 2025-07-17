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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $content = filter_input(INPUT_POST, 'content', FILTER_SANITIZE_STRING);
    $pet_id = filter_input(INPUT_POST, 'pet_id', FILTER_VALIDATE_INT);

    if (empty($content)) {
        echo json_encode(['success' => false, 'message' => '訊息內容不能為空']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO messages (user_id, pet_id, sender, content, created_at) VALUES (?, ?, 'user', ?, NOW())");
        $stmt->execute([$user_id, $pet_id, $content]);
        
        echo json_encode(['success' => true, 'message' => '訊息已送出']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => '系統錯誤']);
    }
} else {
    echo json_encode(['success' => false, 'message' => '錯誤的請求方式']);
}
?>
