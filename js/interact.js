document.addEventListener('DOMContentLoaded', function() {
    console.log('interact.js loaded'); // 調試用
    let userRole = null;
    let currentUserId = null;
    let userPets = [];
    let allUsers = [];

    // 初始化頁面
    console.log('Initializing page...'); // 調試用
    initializePage();

    function initializePage() {
        console.log('initializePage called'); // 調試用
        // 檢查登入狀態和角色
        fetch('php/api/get_session_status.php')
            .then(res => {
                console.log('Session API response status:', res.status); // 調試用
                return res.json();
            })
            .then(data => {
                console.log('Session status:', data); // 調試用
                if (!data.loggedIn) {
                    console.log('User not logged in, showing guest view'); // 調試用
                    showGuestView();
                } else {
                    userRole = data.role || 'user';
                    console.log('User role:', userRole); // 調試用
                    if (userRole === 'shop') {
                        console.log('Showing admin view for shop user'); // 調試用
                        showAdminView();
                    } else {
                        console.log('Showing member view for regular user'); // 調試用
                        showMemberView();
                    }
                }
            })
            .catch(err => {
                console.error('Error checking session:', err);
                showGuestView();
            });
    }

    // 顯示訪客視圖
    function showGuestView() {
        document.getElementById('guest-view').style.display = 'block';
        document.getElementById('member-view').style.display = 'none';
        document.getElementById('admin-view').style.display = 'none';
    }

    // 顯示會員視圖
    function showMemberView() {
        console.log('Showing member view'); // 調試用
        document.getElementById('member-view').style.display = 'block';
        document.getElementById('admin-view').style.display = 'none';
        document.getElementById('guest-view').style.display = 'none';
        
        // 確保元素存在後再載入資料
        setTimeout(() => {
            loadMemberData();
            setupMemberEvents();
        }, 100);
    }

    // 顯示商家視圖
    function showAdminView() {
        console.log('Showing admin view'); // 調試用
        document.getElementById('admin-view').style.display = 'block';
        document.getElementById('member-view').style.display = 'none';
        document.getElementById('guest-view').style.display = 'none';
        
        console.log('Admin view elements:', {
            'admin-view': !!document.getElementById('admin-view'),
            'users-list': !!document.getElementById('users-list'),
            'user-search': !!document.getElementById('user-search')
        });
        
        loadAdminData();
        setupAdminEvents();
    }

    // 載入會員資料
    function loadMemberData() {
        console.log('Loading member data...'); // 調試用
        
        // 檢查必要的元素是否存在
        const userNameElement = document.getElementById('user-name-display');
        const userEmailElement = document.getElementById('user-email-display');
        const petSelectElement = document.getElementById('pet-select');
        
        console.log('Elements check:', {
            userNameElement: !!userNameElement,
            userEmailElement: !!userEmailElement,
            petSelectElement: !!petSelectElement
        });
        
        if (!userNameElement || !userEmailElement || !petSelectElement) {
            console.error('Required elements not found!');
            return;
        }
        
        fetch('php/get_user_info.php')
            .then(res => {
                console.log('Response status:', res.status);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Member data response:', data); // 調試用
                if (data.success) {
                    // 顯示會員資訊
                    userNameElement.textContent = data.user.name;
                    userEmailElement.textContent = data.user.email;
                    
                    // 載入寵物選項
                    petSelectElement.innerHTML = '<option value="">一般諮詢（不指定寵物）</option>';
                    
                    if (data.pets && data.pets.length > 0) {
                        data.pets.forEach(pet => {
                            const option = document.createElement('option');
                            option.value = pet.id;
                            option.textContent = `${pet.name} (${pet.type || '未知種類'})`;
                            petSelectElement.appendChild(option);
                        });
                    }
                    
                    userPets = data.pets;
                    loadMemberMessages();
                } else {
                    console.error('載入會員資訊失敗:', data.message);
                    userNameElement.textContent = '載入失敗';
                    userEmailElement.textContent = '載入失敗';
                }
            })
            .catch(err => {
                console.error('Error loading user info:', err);
                if (userNameElement) userNameElement.textContent = '載入失敗';
                if (userEmailElement) userEmailElement.textContent = '載入失敗';
            });
    }

    // 載入會員訊息
    function loadMemberMessages() {
        console.log('Loading member messages...'); // 調試用
        
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) {
            console.error('Messages container not found!');
            return;
        }
        
        fetch('php/get_messages.php')
            .then(res => {
                console.log('Messages response status:', res.status);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Messages data response:', data); // 調試用
                if (data.success) {
                    renderMemberMessages(data.messages);
                } else {
                    console.error('載入訊息失敗:', data.message);
                    messagesContainer.innerHTML = '<p>無法載入訊息</p>';
                }
            })
            .catch(err => {
                console.error('Error loading messages:', err);
                messagesContainer.innerHTML = '<p>載入失敗</p>';
            });
    }

    // 渲染會員訊息
    function renderMemberMessages(messages) {
        const container = document.getElementById('messages-container');
        if (messages.length === 0) {
            container.innerHTML = '<p>目前沒有任何對話記錄。開始您的第一則訊息吧！</p>';
            return;
        }

        container.innerHTML = messages.map(message => `
            <div class="message-card ${message.sender === 'user' ? 'sent' : 'received'}">
                <div class="message-content">
                    <div class="message-header">
                        <strong>${message.sender === 'user' ? '我' : 'FunSafe 客服'}</strong>
                        ${message.pet_name ? `<span class="pet-tag">關於 ${message.pet_name}</span>` : ''}
                        <span class="message-time">${formatDateTime(message.created_at)}</span>
                    </div>
                    <p>${message.content.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `).join('');
        
        // 自動滾動到最新訊息
        container.scrollTop = container.scrollHeight;
    }

    // 設定會員事件
    function setupMemberEvents() {
        const messageForm = document.getElementById('message-form');
        messageForm.addEventListener('submit', handleMemberMessage);
    }

    // 處理會員訊息發送
    function handleMemberMessage(e) {
        e.preventDefault();
        
        const petId = document.getElementById('pet-select').value || null;
        const content = document.getElementById('message-content').value.trim();
        
        if (!content) {
            alert('請輸入訊息內容');
            return;
        }
        
        const formData = new FormData();
        if (petId) formData.append('pet_id', petId);
        formData.append('content', content);

        console.log('Sending message:', { petId, content }); // 調試用

        fetch('php/send_message.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log('Send message response:', data); // 調試用
            if (data.success) {
                document.getElementById('message-form').reset();
                loadMemberMessages(); // 重新載入訊息列表
                showSuccessMessage('訊息已送出！');
            } else {
                alert(data.message || '傳送失敗');
            }
        })
        .catch(err => {
            console.error('Error sending message:', err);
            alert('傳送失敗，請稍後再試');
        });
    }

    // 載入商家資料
    function loadAdminData() {
        console.log('Loading admin data...'); // 調試用
        
        const usersListElement = document.getElementById('users-list');
        if (!usersListElement) {
            console.error('users-list element not found!');
            return;
        }
        
        fetch('php/admin_get_users.php')
            .then(res => {
                console.log('Admin users response status:', res.status);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Admin users data:', data); // 調試用
                if (data.success) {
                    allUsers = data.users;
                    renderUsersList(data.users);
                } else {
                    console.error('載入商家資料失敗:', data.message, data.debug);
                    usersListElement.innerHTML = `<p>載入失敗: ${data.message}</p>`;
                }
            })
            .catch(err => {
                console.error('Error loading admin users:', err);
                usersListElement.innerHTML = '<p>載入失敗</p>';
            });
    }

    // 渲染用戶列表
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
                <small>註冊於 ${formatDate(user.created_at)}</small>
            </div>
        `).join('');

        // 為用戶項目添加點擊事件
        document.querySelectorAll('.user-item').forEach(item => {
            item.addEventListener('click', function() {
                // 移除其他項目的 active 狀態
                document.querySelectorAll('.user-item').forEach(i => i.classList.remove('active'));
                // 添加當前項目的 active 狀態
                this.classList.add('active');
                
                const userId = this.dataset.userId;
                currentUserId = userId;
                loadAdminConversation(userId);
            });
        });
    }

    // 載入商家對話
    function loadAdminConversation(userId) {
        fetch(`php/admin_get_user_data.php?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderAdminConversation(data);
                } else {
                    document.getElementById('admin-conversation').innerHTML = '<p>載入對話失敗</p>';
                }
            })
            .catch(err => {
                console.error('Error loading conversation:', err);
                document.getElementById('admin-conversation').innerHTML = '<p>載入失敗</p>';
            });
    }

    // 渲染商家對話
    function renderAdminConversation(data) {
        const container = document.getElementById('admin-conversation');
        
        container.innerHTML = `
            <div class="admin-user-info">
                <h4>會員資訊</h4>
                <p><strong>姓名：</strong>${data.user.name}</p>
                <p><strong>Email：</strong>${data.user.email}</p>
                <p><strong>註冊日期：</strong>${formatDate(data.user.created_at)}</p>
            </div>
            
            <div class="admin-pets-list">
                <h4>寵物列表</h4>
                ${data.pets.length === 0 ? '<p>該會員尚未註冊寵物</p>' : 
                  data.pets.map(pet => `
                    <span class="pet-tag-admin">${pet.name} (${pet.type || '未知'})</span>
                  `).join('')
                }
            </div>
            
            <div class="conversation-messages">
                <h4>對話記錄</h4>
                <div class="messages-container" style="max-height: 400px; overflow-y: auto;">
                    ${renderAdminMessages(data.messages)}
                </div>
            </div>
            
            <div class="admin-reply-form">
                <h4>回覆訊息</h4>
                <form id="admin-reply-form">
                    <select id="admin-pet-select" name="pet_id">
                        <option value="">選擇相關寵物（可選）</option>
                        ${data.pets.map(pet => `
                            <option value="${pet.id}">${pet.name} (${pet.type || '未知'})</option>
                        `).join('')}
                    </select>
                    <textarea id="admin-reply-content" name="content" placeholder="輸入回覆內容..." required rows="3"></textarea>
                    <button type="submit">傳送回覆</button>
                </form>
            </div>
        `;

        // 綁定回覆表單事件
        document.getElementById('admin-reply-form').addEventListener('submit', handleAdminReply);
    }

    // 渲染商家訊息
    function renderAdminMessages(messages) {
        if (messages.length === 0) {
            return '<p>目前沒有對話記錄</p>';
        }

        return messages.map(message => `
            <div class="message-card ${message.sender === 'user' ? 'received' : 'sent'}">
                <div class="message-content">
                    <div class="message-header">
                        <strong>${message.sender === 'user' ? '會員' : '客服'}</strong>
                        ${message.pet_name ? `<span class="pet-tag">${message.pet_name}</span>` : ''}
                        <span class="message-time">${formatDateTime(message.created_at)}</span>
                    </div>
                    <p>${message.content.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `).join('');
    }

    // 設定商家事件
    function setupAdminEvents() {
        const searchInput = document.getElementById('user-search');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredUsers = allUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm)
            );
            renderUsersList(filteredUsers);
        });
    }

    // 處理商家回覆
    function handleAdminReply(e) {
        e.preventDefault();
        
        const petId = document.getElementById('admin-pet-select').value || null;
        const content = document.getElementById('admin-reply-content').value.trim();
        
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
                document.getElementById('admin-reply-form').reset();
                loadAdminConversation(currentUserId); // 重新載入對話
                showSuccessMessage('回覆已送出！');
            } else {
                alert(data.message || '回覆失敗');
            }
        })
        .catch(err => {
            console.error('Error sending reply:', err);
            alert('回覆失敗，請稍後再試');
        });
    }

    // 顯示成功訊息
    function showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem;
            border-radius: 6px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
