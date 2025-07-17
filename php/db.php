<?php
$host = 'localhost'; // 資料庫主機位置，通常本機是 localhost
$db   = 'FunSafe';   // 你的資料庫名稱
$user = 'funsafe_user';      // 資料庫使用者名稱，XAMPP 預設是 root
$pass = 'Funsafe2025';          // 資料庫密碼，XAMPP 預設是空
$charset = 'utf8mb4'; // 字元集，通常不用改

$dsn = "mysql:host=$host;dbname=$db;charset=$charset"; // 資料來源名稱，包含主機、資料庫名稱和字元集
$options = [// PDO 選項
    PDO::ATTR_ERRMODE           => PDO::ERRMODE_EXCEPTION,// 錯誤模式設定為異常
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // 預設取回模式為關聯陣列
    PDO::ATTR_EMULATE_PREPARES   => false, // 禁用模擬預處理語句
];
try {
     $pdo = new PDO($dsn, $user, $pass, $options); // 建立 PDO 實例
} catch (\PDOException $e) { // 捕捉 PDO 異常
     throw new \PDOException($e->getMessage(), (int)$e->getCode()); // 拋出異常，包含錯誤訊息和錯誤碼
}
?>