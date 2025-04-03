document.addEventListener("DOMContentLoaded", async () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const tabBar = document.querySelector(".tab-bar");

    
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        
        // 버튼 모양 변경 (☰ → «)
        if (sidebar.classList.contains("hidden")) {
            menuToggle.textContent = "☰";
        } else {
            menuToggle.textContent = "«";
        }
    });

    
});

