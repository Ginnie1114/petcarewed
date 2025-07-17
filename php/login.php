<?php
// filepath: /Applications/XAMPP/xamppfiles/htdocs/FunSafe拷貝/login.php
session_start();
// 假設資料庫連線
require_once 'db.php';

$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$password = $_POST['password'] ?? '';

if ($username && $password) {
    // 查詢會員
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['role'] = $user['role']; // 添加角色設置
        
        // 根據角色重定向到不同頁面
        if ($user['role'] === 'shop') {
            header('Location: ../interact.html'); // 商家重定向到管理界面
        } else {
            header('Location: ../member.html'); // 會員重定向到會員頁面
        }
        exit;
    }
}

// 登入失敗
header('Location: ../login.html?error=1');
exit;
?>