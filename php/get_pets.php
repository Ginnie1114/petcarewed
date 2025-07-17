<?php
// filepath: /Applications/XAMPP/xamppfiles/htdocs/FunSafe拷貝/get_pets.php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, name, type, age FROM pets WHERE member_id=?");
$stmt->execute([$_SESSION['user_id']]);
$pets = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($pets);
?>