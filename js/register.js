document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form[action="php/register.php"]');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    const username = form.username.value.trim();
    const password = form.password.value;
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    // 基本驗證
    if (!username || !password || !name || !email) {
      alert('請完整填寫所有欄位');
      e.preventDefault();
      return;
    }
    if (password.length < 6) {
      alert('密碼長度至少需6碼');
      e.preventDefault();
      return;
    }
    // Email格式驗證
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Email 格式不正確');
      e.preventDefault();
      return;
    }
    // 其他驗證可依需求擴充
  });
});
