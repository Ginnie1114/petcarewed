// ✅ services.js — 服務頁互動功能
// （目前主要為預留結構，未實作大量互動）

// 你可以在這裡加入：
// - 點擊商品卡片開啟詳情（未來）
// - 滾動時動畫（使用 AOS 或自己寫）
// - 其他使用者互動效果

// ⬇️ 範例：頁面載入後讓卡片淡入（純 JS 寫法）
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".product-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, {
    threshold: 0.2 // 滾動到 20% 可見時觸發
  });

  cards.forEach(card => {
    observer.observe(card);
  });
});
