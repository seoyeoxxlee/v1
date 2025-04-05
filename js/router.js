import { CalendarEventsBind } from "./calendar.js";
const routes = {

  "/dashboard": "./pages/dashboard.html",

  "/documents": "./pages/documents.html",

  "/folder": "./pages/folder.html",

  "/bookmark": "./pages/bookmark.html",

  "/account": "./pages/account.html",

  "/trashcan": "./pages/trashcan.html",

  // "/page" : "./pages/page.html"

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
            <h2>안녕하세요.</br></h2>
            <h2>7팀의 <span class="oooh-baby-regular"> Noteflow</span> 입니다.</h2>
          </div>

            <div class="calendar">
                <div class="calendar-container">
                    <div class="calendar-header">
                        <button id="prevBtn">◀️</button>
                        <h2 id="currentMonth"></h2>
                        <button id="nextBtn">▶️</button>
                    </div>
                    <div class="calendar-days">
                        <div class="day">일</div>
                        <div class="day">월</div>
                        <div class="day">화</div>
                        <div class="day">수</div>
                        <div class="day">목</div>
                        <div class="day">금</div>
                        <div class="day">토</div>
                    </div>
                    <div class="calendar-dates" id="calendarDates"></div>
                </div>
            </div>

            <div id="popup" class="popup" style="display: none;">
                <div class="popup-content">
                    <span id="close-popup">×</span>
                    <p id="selected-date"></p>
                    <input id="calendar-title" type="text" placeholder="제목" />
                    <textarea id="calendar-content" placeholder="내용"></textarea>
                    <div id="button-group">
                      <button id="insert-btn">저장</button>
                      <button id="update-btn">수정</button>
                      <button id="delete-btn">삭제</button>
                    </div>
                </div>
            </div>
      `;

      CalendarEventsBind();

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
