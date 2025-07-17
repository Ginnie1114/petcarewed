<?php
// filepath: /Applications/XAMPP/xamppfiles/htdocs/FunSafe拷貝/edit_pet.php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $pet_id = filter_input(INPUT_POST, 'pet_id', FILTER_VALIDATE_INT);
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING);
    $breed = filter_input(INPUT_POST, 'breed', FILTER_SANITIZE_STRING);
    $gender = filter_input(INPUT_POST, 'gender', FILTER_SANITIZE_STRING);
    $birthdate = filter_input(INPUT_POST, 'birthdate');
    $notes = filter_input(INPUT_POST, 'notes', FILTER_SANITIZE_STRING);

    if ($pet_id && $name) {
        // 確認寵物屬於該會員
        $stmt = $pdo->prepare("UPDATE pets SET name=?, type=?, breed=?, gender=?, birthdate=?, notes=? WHERE id=? AND member_id=?");
        $stmt->execute([$name, $type, $breed, $gender, $birthdate, $notes, $pet_id, $user_id]);
    }
}

header('Location: ../member.html'); // 修正為 member.html
exit;
?>