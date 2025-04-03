const routes = {

    "/dashboard": "./pages/dashboard.html",
  
    "/documents": "./pages/documents.html",
  
    "/folder": "./pages/folder.html",

    "/bookmark": "./pages/bookmark.html",

    "/account": "./pages/account.html",

    "/trashcan": "./pages/trashcan.html",
  
  };
  
   
  
  function router(event) {
  
    event.preventDefault();
  
    window.history.pushState({}, "", event.target.href);
  
    handleLocation();
  
  }
  
   
  // 경로값 찾기
  async function handleLocation() {
  
    const pathname = window.location.pathname;
  
    const data = await (await fetch(routes[pathname])).text();
    
    document.querySelector("main").innerHTML = data;
    console.log(data);
  
  }
  
  // 뒤로 가기 , 앞으로 가기
  window.addEventListener("popstate", handleLocation);
  window.addEventListener("DOMContentLoaded", () => {
  
    Array.from(document.querySelectorAll("a")).forEach((el) => {
  
      el.addEventListener("click", router);
  
    });
  
  });