// ✅ contact.js — 負責處理聯絡表單送出後的提示框效果

document.addEventListener("DOMContentLoaded", function () {
  // 取得表單與提示框相關元素
  const form = document.querySelector("form");
  const alertBox = document.querySelector(".form-alert");
  const closeBtn = document.querySelector(".close-alert");

  // 當使用者送出表單時...
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // 先阻止實際送出（之後串接後端再打開）

    // 顯示提示框
    alertBox.classList.add("show");

    // 清空表單欄位（可選）
    form.reset();
  });

  // 當使用者點擊「關閉提示框」按鈕
  closeBtn.addEventListener("click", function () {
    alertBox.classList.remove("show");
  });
});

/* 📌 補充說明：
- 這裡會在按下「送出」按鈕時跳出一個成功提示框
- 提示框要在 HTML 中先寫好結構（通常放 form 下方）
- 串接後端前先用 JS 做假送出流程
*/