// ✅ about.js — 關於我們頁面的互動功能（表單提示）

// ---------- 功能：送出表單後顯示提示框 ----------
// 說明：當使用者送出表單後，顯示成功提示訊息，附帶「關閉」按鈕
// 原理：監聽 form 的 submit 事件，阻止預設動作，再觸發提示框顯示
// 白話：點送出按鈕 → 不會真的寄資料，但會跳出提示「我們會盡快聯絡您」

// 1. 抓取表單與提示框、關閉按鈕的 DOM 元素
const form = document.querySelector('form');
const alertBox = document.querySelector('.form-alert');
const alertCloseBtn = document.querySelector('.form-alert button');

// 2. 當表單送出時（submit 事件）觸發提示框
form.addEventListener('submit', function (e) {
  e.preventDefault(); // ✅ 阻止表單真正送出（因為還沒串接後端）

  // ✅ 顯示提示框（加上 active 類別）
  alertBox.classList.add('active');

  // ✅ 清空欄位（可選）
  form.reset();
});

// 3. 點擊提示框內的關閉按鈕時，把提示框隱藏（移除 active 類別）
alertCloseBtn.addEventListener('click', function () {
  alertBox.classList.remove('active');
});
