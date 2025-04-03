const routes = {

  "/dashboard": "./pages/dashboard.html",

  "/documents": "./pages/documents.html",

  "/folder": "./pages/folder.html",

  "/bookmark": "./pages/bookmark.html",

  "/account": "./pages/account.html",

  "/trashcan": "./pages/trashcan.html",

};

// 페이지를 변경하는 함수
function router(event) {
  event.preventDefault();

  const href = event.target.getAttribute("href");

  window.history.pushState({ path: href }, "", href);
  handleLocation();
}

// 경로에 따라 페이지 변경
async function handleLocation() {
  const pathname = window.location.pathname;
  
  if (pathname === "/" || pathname === "/index.html") {
      // 처음 로드된 화면으로 되돌리기
      document.querySelector("main").innerHTML = `
          <div class="content">
                <h2>#Content</h2>
                <div>
                    <button type="button" id="pageSaveButton">저장</button>
                    <button type="button" id="historyBakButton">↩</button>
                    <button type="button" id="historyForwardButton">↪</button>
                    <div>
                        pageID:<span id="pageId"></span>
                    </div>
                    <div id="contentTitle" contenteditable="true" placeholder="새페이지 제목"></div>
                    <div id="contentBody" contenteditable="true" placeholder="새페이지 내용"></div>
                </div>
            </div>
      `;
      return;
  }

  const route = routes[pathname];

  if (route) {
      const data = await (await fetch(route)).text();
      document.querySelector("main").innerHTML = data;
  }
}

// 뒤로가기/앞으로가기 시 동작
window.addEventListener("popstate", handleLocation);

// DOM 로드 시 초기 설정
window.addEventListener("DOMContentLoaded", () => {
  handleLocation(); // 새로고침 시에도 경로 반영

  document.querySelectorAll("a").forEach((el) => {
      el.addEventListener("click", router);
  });
});
