-- 插入更多測試訊息資料
INSERT INTO `messages` (`user_id`, `pet_id`, `sender`, `content`, `created_at`) VALUES
(2, 1, 'user', '我的小白今天有點沒精神，是不是生病了？', NOW() - INTERVAL 2 HOUR),
(2, 1, 'user', '牠平時很活潑，但今天一直在睡覺', NOW() - INTERVAL 1 HOUR 30 MINUTE),
(2, 2, 'user', '咪咪不願意吃飯，請問該怎麼辦？', NOW() - INTERVAL 1 HOUR),
(2, NULL, 'user', '請問你們有24小時緊急服務嗎？', NOW() - INTERVAL 30 MINUTE);

-- 查看目前所有訊息
SELECT 
    m.id, 
    u.name as user_name, 
    p.name as pet_name, 
    m.sender, 
    m.content, 
    m.created_at,
    m.is_read
FROM messages m
JOIN users u ON m.user_id = u.id
LEFT JOIN pets p ON m.pet_id = p.id
ORDER BY m.created_at DESC;
