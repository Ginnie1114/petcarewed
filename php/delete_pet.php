<?php
// filepath: /Applications/XAMPP/xamppfiles/htdocs/FunSafe拷貝/delete_pet.php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $pet_id = filter_input(INPUT_POST, 'pet_id', FILTER_VALIDATE_INT);

    if ($pet_id) {
        // 確認寵物屬於該會員
        $stmt = $pdo->prepare("DELETE FROM pets WHERE id=? AND member_id=?");
        $stmt->execute([$pet_id, $user_id]);
    }
}

header('Location: ../member.php');
exit;
?>