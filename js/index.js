// ✅ index.js — 首頁互動功能

// ---------- 功能 1：淡入 Hero 區塊的文字 ----------
// 說明：當畫面載入完成，讓 Hero 文字區塊加上 "show" class，產生動畫效果
// 原理：搭配 CSS transition，讓標語文字從下方滑入 & 淡入
// 白話：就是讓開場文字變得有戲劇張力，進場更漂亮

window.addEventListener('DOMContentLoaded', function () {
  // 抓取 hero 區塊的 h2 元素，加上動畫 class
  const heroHeading = document.querySelector('.hero h2');
  heroHeading.classList.add('show');
});


// ---------- 功能 2：點擊 Learn More 會滑動到 About 區塊 ----------
// 說明：讓使用者點擊按鈕後，自動平滑捲動到頁面中段（.about-preview）
// 原理：用 scrollIntoView()，搭配 smooth 設定即可
// 白話：點 Learn More 不再跳轉，而是自然滑動到下方介紹區域

const learnMoreBtn = document.querySelector('.learn-more');
if (learnMoreBtn) {
  learnMoreBtn.addEventListener('click', function (e) {
    e.preventDefault(); // 阻止超連結跳頁預設行為
    const aboutSection = document.querySelector('.about-preview');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' }); // 使用平滑動畫滾動
    }
  });
}


// ---------- 功能 3：導覽列在滑動時固定在頂端 ----------
// 說明：當使用者向下滑動頁面，導覽列會自動加上 "scrolled" class
// 原理：監聽 scroll 事件，根據 scrollY 值來判斷是否加上 class
// 白話：滑下去時讓導覽列變背景白、陰影，視覺上不會消失

const header = document.querySelector('#site-header');
window.addEventListener('scroll', function () {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
