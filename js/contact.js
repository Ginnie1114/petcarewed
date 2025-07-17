// ✅ contact.js — 負責處理聯絡表單送出後的提示框效果


/* 📌 補充說明：
- 這裡會在按下「送出」按鈕時跳出一個成功提示框
- 提示框要在 HTML 中先寫好結構（通常放 form 下方）
- 串接後端前先用 JS 做假送出流程
*/


document.querySelector('form').addEventListener('submit', function (e) {
  const start = new Date(document.getElementById('start-date').value);
  const end = new Date(document.getElementById('end-date').value);
  if (start > end) {
    e.preventDefault();
    alert('結束日期不能早於開始日期喔！');
  }
});


document.addEventListener("DOMContentLoaded", function () {
    let isLoggedIn = false;
    let memberData = null;

    // 檢查登入狀態
    fetch('php/api/get_session_status.php')
        .then(res => res.json())
        .then(data => {
            isLoggedIn = data.loggedIn;
            if (isLoggedIn) {
                loadMemberData();
            }
        });

    // 載入會員資料
    function loadMemberData() {
        fetch('php/get_user_info.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    memberData = data;
                    setupMemberInterface();
                    loadMessages();
                }
            });
    }

    // 設置會員介面
    function setupMemberInterface() {
        // 顯示會員資訊區塊
        document.getElementById('member-messages').style.display = 'block';
        
        // 更新標題
        document.getElementById('contact-title').textContent = '預約諮詢 & 我的訊息';
        
        // 隱藏訪客欄位，顯示會員欄位
        document.getElementById('guest-fields').style.display = 'none';
        document.getElementById('member-fields').style.display = 'block';
        document.getElementById('quick-message-section').style.display = 'block';
        
        // 填入會員資料
        document.getElementById('member-name-display').textContent = memberData.user.name;
        document.getElementById('member-email-display').textContent = memberData.user.email;
        
        // 載入寵物選項
        const petSelect = document.getElementById('pet-select');
        petSelect.innerHTML = '<option value="">請選擇寵物</option>';
        memberData.pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = `${pet.name} (${pet.type || '未知'})`;
            petSelect.appendChild(option);
        });
    }

    // 載入訊息
    function loadMessages() {
        fetch('php/get_messages.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderMessages(data.messages);
                }
            });
    }

    // 渲染訊息
    function renderMessages(messages) {
        const container = document.getElementById('messages-container');
        if (messages.length === 0) {
            container.innerHTML = '<p>目前沒有任何訊息。</p>';
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
    }

    // 格式化時間
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

    // 表單提交處理
    const form = document.getElementById('contact-form');
    const alertBox = document.querySelector(".form-alert");
    const closeBtn = document.querySelector(".close-alert");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        if (isLoggedIn) {
            // 會員預約表單處理
            const petId = document.getElementById('pet-select').value;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const message = document.getElementById('message').value;
            
            if (!petId) {
                alert('請選擇寵物');
                return;
            }
            
            // 這裡可以添加預約 API 調用
            alertBox.classList.add("show");
            form.reset();
        } else {
            // 訪客表單處理
            alertBox.classList.add("show");
            form.reset();
        }
    });

    // 快速訊息表單
    const quickForm = document.getElementById('quick-message-form');
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const content = this.content.value.trim();
            if (!content) {
                alert('請輸入訊息內容');
                return;
            }
            
            const formData = new FormData();
            formData.append('pet_id', ''); // 快速訊息不指定寵物
            formData.append('content', content);

            fetch('php/send_message.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.reset();
                    loadMessages();
                    alert('訊息已送出');
                } else {
                    alert(data.message || '傳送失敗');
                }
            });
        });
    }

    // 關閉提示框
    closeBtn.addEventListener("click", function () {
        alertBox.classList.remove("show");
    });

    // 日期驗證
    document.getElementById('start-date').addEventListener('change', validateDates);
    document.getElementById('end-date').addEventListener('change', validateDates);

    function validateDates() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            alert('結束日期不能早於開始日期');
            document.getElementById('end-date').value = '';
        }
    }
});
