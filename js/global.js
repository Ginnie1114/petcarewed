// ✅ global.js — 全站通用互動功能

// 1️⃣ Sticky header 小補強：滾動時縮小 header
window.addEventListener("scroll", function () {
  const header = document.getElementById("site-header");

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// 🔍 補充說明：
// 這段程式碼會在頁面捲動超過 50px 時，
// 替 header 加上 .scrolled class，用來加陰影或縮小 padding 等。
// 你可在 global.css 加上這個樣式：

// header.scrolled {
//   box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//   background-color: #fff;
//   transition: all 0.3s ease;
// }



// 2️⃣ 漢堡選單開關
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.querySelector(".nav-links");
  console.log('hamburger:', hamburger);
  console.log('navLinks:', navLinks);
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // 點擊選單連結自動關閉（可選）
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });
});


  document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
    const text = el.textContent.trim(); // 取得文字內容並移除前後空白

    // 判斷是否包含中文字（\u4e00-\u9fff 是常見中文編碼範圍）
    const isChinese = /[\u4e00-\u9fff]/.test(text);

    // 根據結果加上對應的 class
    if (isChinese) {
      el.classList.add('lang-zh'); // 如果是中文
    } else {
      el.classList.add('lang-en'); // 如果是英文
    }
  });
