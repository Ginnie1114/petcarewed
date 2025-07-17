document.addEventListener('DOMContentLoaded', function() {
    let currentUserId = null;
    let userPets = [];

    // 檢查商家登入狀態
    fetch('php/api/get_session_status.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'admin_login.html';
            } else {
                // 驗證是否為商家角色
                checkAdminRole();
            }
        });

    function checkAdminRole() {
        fetch('php/admin_check_role.php')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.role === 'shop') {
                    document.getElementById('admin-name').textContent = data.name;
                    loadUsers();
                } else {
                    alert('您沒有後台管理權限');
                    window.location.href = 'login.html';
                }
            })
            .catch(err => {
                console.error('Error checking admin role:', err);
                alert('權限驗證失敗');
                window.location.href = 'login.html';
            });
    }

    // 載入會員列表
    function loadUsers() {
        fetch('php/admin_get_users.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderUsersList(data.users);
                } else {
                    document.getElementById('users-list').innerHTML = '<p>載入失敗</p>';
                }
            })
            .catch(err => {
                console.error('Error loading users:', err);
                document.getElementById('users-list').innerHTML = '<p>載入失敗</p>';
            });
    }

    // 渲染會員列表
    function renderUsersList(users) {
        const container = document.getElementById('users-list');
        if (users.length === 0) {
            container.innerHTML = '<p>目前沒有會員</p>';
            return;
        }

        container.innerHTML = users.map(user => `
            <div class="user-item" data-user-id="${user.id}">
                <strong>${user.name}</strong>
                <div>${user.email}</div>
                <small>註冊日期: ${formatDate(user.created_at)}</small>
            </div>
        `).join('');

        // 為會員項目添加點擊事件
        document.querySelectorAll('.user-item').forEach(item => {
            item.addEventListener('click', function() {
                // 移除其他項目的 active 狀態
                document.querySelectorAll('.user-item').forEach(i => i.classList.remove('active'));
                // 添加當前項目的 active 狀態
                this.classList.add('active');
                
                const userId = this.dataset.userId;
                currentUserId = userId;
                loadUserDetails(userId);
            });
        });
    }

    // 載入會員詳細資訊
    function loadUserDetails(userId) {
        fetch(`php/admin_get_user_data.php?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    userPets = data.pets;
                    renderUserDetails(data);
                } else {
                    document.getElementById('user-details').innerHTML = '<p>載入會員資訊失敗</p>';
                }
            })
            .catch(err => {
                console.error('Error loading user details:', err);
                document.getElementById('user-details').innerHTML = '<p>載入失敗</p>';
            });
    }

    // 渲染會員詳細資訊
    function renderUserDetails(data) {
        const container = document.getElementById('user-details');
        
        container.innerHTML = `
            <div class="user-info">
                <h3>會員資訊</h3>
                <p><strong>姓名：</strong>${data.user.name}</p>
                <p><strong>Email：</strong>${data.user.email}</p>
                <p><strong>註冊日期：</strong>${formatDate(data.user.created_at)}</p>
            </div>
            
            <div class="pets-section">
                <h3>寵物列表</h3>
                ${data.pets.length === 0 ? '<p>該會員尚未註冊寵物</p>' : 
                  data.pets.map(pet => `
                    <div class="pet-item">
                        <strong>${pet.name}</strong> (${pet.type || '未知'})
                        ${pet.breed ? `<span> - ${pet.breed}</span>` : ''}
                        ${pet.gender ? `<span> - ${pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : '其他'}</span>` : ''}
                    </div>
                  `).join('')
                }
            </div>
            
            <div class="messages-section">
                <h3>對話記錄</h3>
                <div class="messages-container" id="messages-container">
                    ${renderMessages(data.messages)}
                </div>
                
                <div class="reply-form">
                    <h4>回覆訊息</h4>
                    <form id="reply-form">
                        <select id="reply-pet-select" name="pet_id">
                            <option value="">選擇相關寵物（可選）</option>
                            ${data.pets.map(pet => `
                                <option value="${pet.id}">${pet.name} (${pet.type || '未知'})</option>
                            `).join('')}
                        </select>
                        <textarea id="reply-content" name="content" placeholder="輸入回覆內容..." required></textarea>
                        <button type="submit">傳送回覆</button>
                    </form>
                </div>
            </div>
        `;

        // 綁定回覆表單事件
        document.getElementById('reply-form').addEventListener('submit', handleReply);
    }

    // 渲染訊息
    function renderMessages(messages) {
        if (messages.length === 0) {
            return '<p>目前沒有對話記錄</p>';
        }

        return messages.map(message => `
            <div class="message-card ${message.sender === 'user' ? 'received' : 'sent'}">
                <div class="message-header">
                    <strong>${message.sender === 'user' ? '會員' : '客服'}</strong>
                    ${message.pet_name ? `<span class="pet-tag">${message.pet_name}</span>` : ''}
                    <span class="message-time">${formatDateTime(message.created_at)}</span>
                </div>
                <p>${message.content.replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');
    }

    // 處理回覆
    function handleReply(e) {
        e.preventDefault();
        
        const petId = document.getElementById('reply-pet-select').value || null;
        const content = document.getElementById('reply-content').value.trim();
        
        if (!content) {
            alert('請輸入回覆內容');
            return;
        }
        
        const formData = new FormData();
        formData.append('user_id', currentUserId);
        if (petId) formData.append('pet_id', petId);
        formData.append('content', content);

        fetch('php/admin_send_message.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById('reply-form').reset();
                loadUserDetails(currentUserId); // 重新載入以更新訊息
                alert('回覆已送出');
            } else {
                alert(data.message || '回覆失敗');
            }
        })
        .catch(err => {
            console.error('Error sending reply:', err);
            alert('回覆失敗，請稍後再試');
        });
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW');
    }

    // 格式化日期時間
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
});
