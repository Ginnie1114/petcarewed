<?php
// filepath: /Applications/XAMPP/xamppfiles/htdocs/FunSafe拷貝/php/register.php
session_start();
require_once 'db.php';

// 使用 filter_input 進行資料過濾與驗證
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$password = $_POST['password'] ?? '';
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

if ($username && $password && $name && $email) {
    // 基本驗證
    if (!preg_match('/^[a-zA-Z0-9_]{4,20}$/', $username)) {
        header('Location: ../register.html?error=username');
        exit;
    }
    if (strlen($password) < 6) {
        header('Location: ../register.html?error=password');
        exit;
    }
    
    // 檢查帳號或 email 是否已存在
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username=? OR email=?");
    $stmt->execute([$username, $email]);
    if ($stmt->fetch()) {
        header('Location: ../register.html?error=exists');
        exit;
    }
    // 新增會員
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$username, $hash, $name, $email])) {
        // 自動登入
        $user_id = $pdo->lastInsertId();
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        $_SESSION['name'] = $name;
        header('Location: ../member.html'); // 改為 member.html
        exit;
    } else {
        header('Location: ../register.html?error=insert');
        exit;
    }
} else {
    // 如果有任何一個欄位是空的或無效的
    header('Location: ../register.html?error=invalid');
    exit;
}
?>