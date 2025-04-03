document.addEventListener("DOMContentLoaded", async () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const tabBar = document.querySelector(".tab-bar");

    
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");

        // 버튼 모양 변경 (☰ → «)
        menuToggle.textContent = sidebar.classList.contains("hidden") ? "☰" : "«";
    });

    
     // 현재 경로 가져오기
     const pathParts = window.location.pathname.split("/").filter(part => part); // 빈 값 제거

     // 경로 한글명 매핑
     const pageNames = {
         "dashboard": "대시보드",
         "documents": "문서",
         "folder": "폴더",
         "bookmark": "즐겨찾기",
         "account": "계정",
         "trashcan": "휴지통"
     };
 
     // 현재 경로의 Breadcrumb(경로 표시) 만들기
     let breadcrumb = pathParts.map((part, index) => {
         // 첫 번째 경로는 한글명 변환, 그 이후는 원래 값 사용
         if (index === 0 && pageNames[part]) {
             return pageNames[part];
         }
         return part; // 하위 페이지는 그대로 표시 (예: 문서 제목)
     }).join(" > ");
 
     // 문서 상세 페이지인 경우 API에서 제목 가져오기
     if (pathParts[0] === "documents" && pathParts.length > 1) {
         try {
             const docId = pathParts[pathParts.length - 1]; // 마지막 요소를 문서 ID로 사용
             const response = await fetch(`/api/documents/${docId}`); // API 호출
             const data = await response.json(); // 응답 JSON 변환
             if (data.title) {
                 breadcrumb = breadcrumb.replace(docId, data.title); // ID 대신 문서 제목으로 대체
             }
         } catch (error) {
             console.error("문서 정보를 불러오는 중 오류 발생:", error);
         }
     }
 
     // 헤더에 반영
     tabBar.textContent = breadcrumb;
});