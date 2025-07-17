
  // 檢查網址參數，顯示註冊成功或帳號已註冊彈窗
  if (location.search.includes('register=success')) {
    document.getElementById('register-success-modal').style.display = 'block';
  }
  if (location.search.includes('register=exists')) {
    document.getElementById('register-exists-modal').style.display = 'block';
  }
  document.getElementById('close-register-modal').onclick = function() {
    document.getElementById('register-success-modal').style.display = 'none';
    const url = new URL(location);
    url.searchParams.delete('register');
    history.replaceState(null, '', url.pathname + url.search);
  };
  document.getElementById('close-exists-modal').onclick = function() {
    document.getElementById('register-exists-modal').style.display = 'none';
    const url = new URL(location);
    url.searchParams.delete('register');
    history.replaceState(null, '', url.pathname + url.search);
  };
