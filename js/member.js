document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    fetch('php/api/get_session_status.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'login.html';
            } else {
                loadMemberData();
            }
        });

    const addPetBtn = document.getElementById('add-pet-btn');
    const modal = document.getElementById('pet-modal');
    const closeBtn = document.querySelector('.close-btn');
    const petForm = document.getElementById('pet-form');

    // 載入會員與寵物資料
    function loadMemberData() {
        fetch('php/api/get_member_data.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderMemberDetails(data.user);
                    renderPetsList(data.pets);
                } else {
                    alert(data.message);
                }
            });
    }

    // 渲染會員資料
    function renderMemberDetails(user) {
        const container = document.getElementById('member-details');
        container.innerHTML = `
            <div class="member-form-style">
                <label>帳號</label><input type="text" value="${user.username}" readonly>
                <label>姓名</label><input type="text" value="${user.name}" readonly>
                <label>Email</label><input type="email" value="${user.email}" readonly>
            </div>
        `;
    }

    // 渲染寵物列表
    function renderPetsList(pets) {
        const list = document.getElementById('pets-list');
        if (pets.length === 0) {
            list.innerHTML = '<p>尚未新增寵物。</p>';
            return;
        }
        list.innerHTML = pets.map(pet => `
            <div class="pet-item" data-id="${pet.id}">
                <span>${pet.name} (${pet.type || '未知種類'})</span>
                <div>
                    <button class="edit-pet-btn">編輯</button>
                    <button class="delete-pet-btn">刪除</button>
                </div>
            </div>
        `).join('');
        
        // 為新產生的按鈕加上事件監聽
        addPetEventListeners(pets);
    }
    
    // 為寵物列表的按鈕加上事件
    function addPetEventListeners(pets) {
        document.querySelectorAll('.edit-pet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const petId = e.target.closest('.pet-item').dataset.id;
                const petData = pets.find(p => p.id == petId);
                openModal(true, petData);
            });
        });

        document.querySelectorAll('.delete-pet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('確定要刪除這隻寵物嗎？')) {
                    const petId = e.target.closest('.pet-item').dataset.id;
                    deletePet(petId);
                }
            });
        });
    }

    // 新增刪除寵物功能
    function deletePet(petId) {
        const formData = new FormData();
        formData.append('pet_id', petId);

        fetch('php/delete_pet.php', {
            method: 'POST',
            body: formData
        })
        .then(() => {
            loadMemberData(); // 重新載入資料
            alert('寵物已刪除');
        })
        .catch(err => {
            console.error('Error deleting pet:', err);
            alert('刪除失敗');
        });
    }

    // 開啟 Modal (新增或編輯)
    function openModal(isEdit = false, pet = {}) {
        petForm.reset();
        document.getElementById('modal-title').textContent = isEdit ? '編輯寵物' : '新增寵物';
        document.getElementById('pet-id').value = isEdit ? pet.id : '';
        if(isEdit) {
            document.getElementById('pet-name').value = pet.name;
            document.getElementById('pet-type').value = pet.type;
            document.getElementById('pet-breed').value = pet.breed;
            document.getElementById('pet-gender').value = pet.gender;
            document.getElementById('pet-birthdate').value = pet.birthdate;
            document.getElementById('pet-notes').value = pet.notes;
        }
        modal.style.display = 'block';
    }

    // 關閉 Modal
    function closeModal() {
        modal.style.display = 'none';
    }

    addPetBtn.addEventListener('click', () => openModal(false));
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });

    // 表單提交
    petForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(petForm);
        const isEdit = !!document.getElementById('pet-id').value;
        const url = isEdit ? 'php/edit_pet.php' : 'php/add_pet.php';

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                closeModal();
                loadMemberData(); // 重新載入資料以更新畫面
            } else {
                alert(data.message || '操作失敗');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('發生錯誤');
        });
    });
});
