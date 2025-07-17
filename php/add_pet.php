<?php
// filepath: /Applications/XAMPP/xamppfiles/htdocs/FunSafe拷貝/add_pet.php
session_start(); // 啟動 session
require_once 'db.php'; // 引入資料庫連線
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) { // 檢查是否登入
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => '未登入']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING);
    $breed = filter_input(INPUT_POST, 'breed', FILTER_SANITIZE_STRING);
    $gender = filter_input(INPUT_POST, 'gender', FILTER_SANITIZE_STRING);
    $birthdate = filter_input(INPUT_POST, 'birthdate');
    $notes = filter_input(INPUT_POST, 'notes', FILTER_SANITIZE_STRING);

    if ($name) {
        $stmt = $pdo->prepare(
            "INSERT INTO pets (member_id, name, type, breed, gender, birthdate, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        if ($stmt->execute([$user_id, $name, $type, $breed, $gender, $birthdate, $notes])) {
            echo json_encode(['success' => true, 'message' => '新增成功']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => '資料庫錯誤']);
        }
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => '資料不完整']);
?>