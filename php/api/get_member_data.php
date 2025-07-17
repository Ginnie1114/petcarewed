<?php
require_once 'session_check.php';
require_once '../db.php';

$user_id = $_SESSION['user_id'];

// 取得會員資料
$stmt = $pdo->prepare("SELECT id, username, name, email FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

// 取得寵物資料
$stmt = $pdo->prepare("SELECT * FROM pets WHERE member_id = ? ORDER BY id DESC");
$stmt->execute([$user_id]);
$pets = $stmt->fetchAll();

if (!$user) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => '找不到使用者資料']);
    exit;
}

echo json_encode([
    'success' => true,
    'user' => $user,
    'pets' => $pets
]);
?>
