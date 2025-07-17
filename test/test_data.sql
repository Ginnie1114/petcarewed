-- 插入測試用會員資料
INSERT INTO `users` (`username`, `password`, `name`, `email`, `role`) VALUES
('testuser', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '測試會員', 'test@example.com', 'user');

-- 取得剛插入的會員 ID
SET @user_id = LAST_INSERT_ID();

-- 插入測試寵物資料
INSERT INTO `pets` (`member_id`, `name`, `type`, `age`) VALUES
(@user_id, '小白', '狗', 3),
(@user_id, '咪咪', '貓', 2);

-- 插入測試訊息資料
INSERT INTO `messages` (`user_id`, `pet_id`, `sender`, `content`, `created_at`) VALUES
(@user_id, (SELECT id FROM pets WHERE name = '小白' AND member_id = @user_id), 'user', '你好，我的小白最近食慾不振，請問該怎麼辦？', NOW() - INTERVAL 1 HOUR),
(@user_id, (SELECT id FROM pets WHERE name = '小白' AND member_id = @user_id), 'merchant', '您好！食慾不振可能有多種原因，建議先觀察是否有其他症狀，如果持續建議就醫檢查。', NOW() - INTERVAL 30 MINUTE),
(@user_id, NULL, 'user', '請問你們有提供寵物美容服務嗎？', NOW() - INTERVAL 10 MINUTE);
