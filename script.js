document.addEventListener("DOMContentLoaded", async () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const tabBar = document.querySelector(".tab-bar");

    const switchButton = document.getElementById("switch");
    const main = document.querySelector("main");

    // 사이드바 햄버거 버튼 토글
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        
        // 버튼 모양 변경 (☰ → «)
        if (sidebar.classList.contains("hidden")) {
            menuToggle.textContent = "☰";
        } else {
            menuToggle.textContent = "«";
        }
    });

    // 다크모드 토글
    switchButton.addEventListener("change", function () {
        main.classList.toggle("dark-mode", this.checked);
    });
});

