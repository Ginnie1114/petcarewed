// ✅ global.js — 全站通用互動功能 (重構版)

document.addEventListener("DOMContentLoaded", function () {
    
    // 1️⃣ 動態渲染 Header (這是第一步，因為後續功能依賴它)
    renderHeader();

    // 2️⃣ 監聽滾動事件，為 Header 加上 scrolled class
    window.addEventListener("scroll", handleHeaderScroll);

    // 3️⃣ 自動為標題加上語言 class (lang-en / lang-zh)
    applyLanguageClassToHeadings();

    // 4️⃣ 設定輪播圖片功能
    setupCarousel();

    // 5️⃣ 設定數字動畫
    setupStatAnimation();

    // ===================================================================
    // 函式定義區
    // ===================================================================

    /**
     * 動態渲染 Header 內容
     * 透過 API 取得登入狀態，並顯示對應的導覽列
     */
    function renderHeader() {
        const header = document.getElementById('site-header');
        if (!header) return;

        fetch('php/api/get_session_status.php')
            .then(res => res.json())
            .then(data => {
                let memberMenuHTML = '';
                if (data.loggedIn) {
                    const unreadDot = data.unread_messages > 0 ? `<span id="nav-msg-dot" style="color:red;">●</span>` : '';
                    memberMenuHTML = `
                        <li class="member-menu">
                            <a href="member.html" aria-label="member"><i class="iconoir-user-love"></i></a>
                            <div class="member-dropdown">
                                <div class="dropdown-user">您好, ${data.name}</div>
                                <a href="member.html" class="dropdown-btn">會員專區</a>
                                <a href="interact.html" class="dropdown-btn">互動中心 ${unreadDot}</a>
                                <a href="php/logout.php" class="dropdown-btn">登出</a>
                            </div>
                        </li>
                    `;
                } else {
                    memberMenuHTML = `
                        <li class="member-menu">
                            <a href="login.html" aria-label="member"><i class="iconoir-user-love"></i></a>
                            <div class="member-dropdown">
                                <a href="login.html" class="dropdown-btn">登入</a>
                                <a href="register.html" class="dropdown-btn">註冊</a>
                            </div>
                        </li>
                    `;
                }

                header.innerHTML = `
                    <div class="container">
                        <h1><a href="index.html" class="logo">FunSafe</a></h1>
                        <div class="hamburger" id="hamburger-btn" aria-label="開啟主選單" tabindex="0">
                            <span></span><span></span><span></span>
                        </div>
                        <nav>
                            <ul class="nav-links">
                                ${memberMenuHTML}
                                <li><a href="about.html">About</a></li>
                                <li><a href="services.html">Services</a></li>
                                <li><a href="interact.html" class="book-now-btn">聯絡我們</a></li>
                            </ul>
                        </nav>
                    </div>
                `;
                // Header 渲染完畢後，才能為漢堡選單綁定事件
                setupHamburger();
                
                // 🔥 重要：重新為動態生成的標題套用語言 class
                applyLanguageClassToHeadings();
            })
            .catch(err => {
                console.error('無法渲染 Header:', err);
                // 即使 API 失敗，也要顯示一個基本的 Header
                header.innerHTML = `
                    <div class="container">
                        <h1><a href="index.html" class="logo">FunSafe</a></h1>
                        <div class="hamburger" id="hamburger-btn" aria-label="開啟主選單" tabindex="0">
                            <span></span><span></span><span></span>
                        </div>
                        <nav>
                            <ul class="nav-links">
                                <li class="member-menu">
                                    <a href="login.html" aria-label="member"><i class="iconoir-user-love"></i></a>
                                    <div class="member-dropdown">
                                        <a href="login.html" class="dropdown-btn">登入</a>
                                        <a href="register.html" class="dropdown-btn">註冊</a>
                                    </div>
                                </li>
                                <li><a href="about.html">About</a></li>
                                <li><a href="services.html">Services</a></li>
                                <li><a href="interact.html" class="book-now-btn">聯絡我們</a></li>
                            </ul>
                        </nav>
                    </div>
                `;
                // 失敗時也要綁定漢堡選單事件
                setupHamburger();
                applyLanguageClassToHeadings();
            });
    }

    /**
     * 為漢堡選單按鈕設定點擊事件
     */
    function setupHamburger() {
        const hamburger = document.getElementById("hamburger-btn");
        const nav = document.querySelector("nav");
        const navLinks = document.querySelector(".nav-links");
        
        if (!hamburger || !nav || !navLinks) return;

        hamburger.addEventListener("click", function () {
            hamburger.classList.toggle("active");
            nav.classList.toggle("show");
            navLinks.classList.toggle("open");
        });

        // 點擊選單連結自動關閉
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                nav.classList.remove("show");
                navLinks.classList.remove("open");
            });
        });
    }

    /**
     * 處理頁面滾動時 Header 的樣式變化
     */
    function handleHeaderScroll() {
        const header = document.getElementById("site-header");
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    /**
     * 遍歷 h1-h4 標籤，根據內容是中文還是英文，加上對應的 class
     */
    function applyLanguageClassToHeadings() {
        document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
            const text = el.textContent.trim();
            const isChinese = /[\u4e00-\u9fff]/.test(text);
            if (isChinese) {
                el.classList.add('lang-zh');
            } else {
                el.classList.add('lang-en');
            }
        });
    }

    /**
     * 設定輪播圖片功能
     */
    function setupCarousel() {
        const track = document.querySelector("#carouselTrack");
        if (!track) return;

        // 複製圖片一輪實現無縫滾動
        const images = Array.from(track.children);
        images.forEach(img => {
            const clone = img.cloneNode(true);
            track.appendChild(clone);
        });

        // Hover 預覽圖
        track.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("carousel-image")) {
                track.style.animationPlayState = "paused";
                createPreview(e.target);
            }
        });

        track.addEventListener("mouseout", (e) => {
            if (e.target.classList.contains("carousel-image")) {
                track.style.animationPlayState = "running";
                removePreview(e.target);
            }
        });
    }

    function createPreview(target) {
        const rect = target.getBoundingClientRect();
        const preview = target.cloneNode();
        preview.classList.add("image-preview");
        preview.style.position = "fixed";

        let previewWidth, previewHeight, left, top;

        if (window.innerWidth <= 480) {
            previewWidth = window.innerWidth * 0.9;
            previewHeight = window.innerHeight * 0.6;
            left = (window.innerWidth - previewWidth) / 2;
            top = (window.innerHeight - previewHeight) / 2;
        } else if (window.innerWidth <= 768) {
            previewWidth = 220;
            previewHeight = 150;
            left = rect.left;
            top = rect.top - 50;
        } else {
            previewWidth = 300;
            previewHeight = 200;
            left = rect.left;
            top = rect.top - 50;
        }

        preview.style.width = `${previewWidth}px`;
        preview.style.height = `${previewHeight}px`;
        preview.style.left = `${left}px`;
        preview.style.top = `${top}px`;
        preview.style.zIndex = "9999";
        preview.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.3)";
        preview.style.borderRadius = "12px";
        preview.style.transition = "all 0.3s ease";
        preview.style.pointerEvents = "none";

        document.body.appendChild(preview);
        target._previewElement = preview;
    }

    function removePreview(target) {
        if (target._previewElement) {
            target._previewElement.remove();
            target._previewElement = null;
        }
    }

    // 整合數字動畫功能
    function setupStatAnimation() {
        const statEl = document.querySelector('.stat-number');
        if (statEl) {
            const target = parseInt(statEl.dataset.target);
            
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumber(statEl, target);
                        observer.unobserve(statEl);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(statEl);
        }
    }

    function animateNumber(el, target, duration = 1500) {
        let start = 0;
        const increment = target / (duration / 35);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.textContent = target + "+";
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(start);
            }
        }, 30);
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



