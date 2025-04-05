
document.addEventListener("DOMContentLoaded",()=>{
    
    let pageTitle;
    let pageText;
    let lineList;
    let receivedData;// 현재 글 쓰그 있는 페이지 id 값

    // API에 PUT
    const API = 'https://kdt-api.fe.dev-cos.com/documents';
    const main = document.querySelector('main');

    // 페이지를 변경하는 함수
    function router(event) {
        event.preventDefault();
    
        const href = event.target.getAttribute("href");
    
        window.history.pushState({ path: href }, "", href);
        handleLocation();
    }
    
    // 경로에 따라 페이지 변경
    async function handleLocation() {
        const pathname = "/"+window.location.pathname.split("/")[1];

        if(pathname == "/page"){
            receivedData=window.location.pathname.split("/")[2];
        }

        const route = "/pages/page.html";
        
        const data = await (await fetch(route)).text();
        let promise = new Promise((resolve, reject) => {
            document.querySelector("main").innerHTML = data;
        });    


        await routerAfter(receivedData);
    }
    document.addEventListener("click",(e)=>{
        if((e.target.classList.contains("pageLink") && e.target.href.split("/")[3]) 
                || e.target.classList.contains("subPage")){
            router(e);

            // 헤더 페이지명 바뀌는 부분 backward, forward 안되서 수정 함. 아래 코드는 주석
            // receivedContent = e.target.textContent; 
            // tabTitle.textContent = receivedContent;
        }
    })
    window.addEventListener("popstate", handleLocation);

    function routerAfter(id){   
        
        pageTitle = main.querySelector("#pageTitle");
        pageText = main.querySelector("#pageText");

        getPage(id);
    }

    // 페이지 가져오기 함수
    function getPage(id){
        fetch(API+"/"+id,{
            headers: {
                "x-username" : "team7_pages"
            }
        })
        .catch((error)=>{console.log('데이터 값이 없습니다.')})
        .then((response) => response.json())
        .then((page) => { 
            if(page != undefined){
                setPage(page);
            } 
        });
    }
    

    // 페이지 셋팅 함수
    async function setPage(data){
        // 헤더 페이지명 backward, forward 가능하게
        tabTitle.textContent = data['title'] == "" ? "새페이지" : data['title'];
        pageTitle.value=data['title'];
       
        await eventAdd();

        const prePageText = document.createElement("p");
        prePageText.innerHTML = data['content'];
        if(prePageText.querySelectorAll('.subPage').length > 0){
            const subPages = prePageText.querySelectorAll('.subPage');
            //서브페이지가 존재하면 이름 바꿔주기
            subPages.forEach((sub,i)=>{
                fetch(API+"/"+sub.id.split("s")[1],{
                    headers: {
                        "x-username" : "team7_pages"
                    }
                })
                .then((response) => {
                    if (!response.ok) {
                        sub.remove();
                        console.log("삭제된페이지");  
                        // pageText.innerHTML = prePageText.innerHTML;
                    }

                    return response.json();
                })
                .then((json) => {
                    json["title"]==="" ? sub.textContent="새페이지" : sub.textContent=json["title"];
                })
                .then(()=>{
                    pageText.innerHTML = prePageText.innerHTML;
                })
                .catch((error)=>{
                    console.log('Error');
                })     
            });
        }else{
            pageText.innerHTML = data['content'];
        }

    }

    // 셋팅 후 요소들에 함수 넣기
    function eventAdd(){
        // 페이지 시작시 pageTitle에 focus
        pageTitle.focus();
        // 제목에서 엔터 쳤을때 본문에 텍스트 박스 만들기 
        
        pageTitle.addEventListener('keyup',(e)=>{
            if(e.keyCode == 13){
                e.preventDefault();
                pageText.prepend(textLineCreate());
                // lineInit();
                lineList = main.querySelectorAll('#pageText .line .text')
                lineList[0].focus();
            }else if(e.keyCode == 40){
                lineList[0].focus();
            }
            save(receivedData);
        });
        // 본문 백그라운드 클릭시 라인 추가
        pageText.addEventListener('click',(e)=>{
            if(e.target.id === "pageText"){
                e.currentTarget.append(textLineCreate());
                // 생성된 마지막 요소에 포커스
                document.querySelectorAll('#pageText .line .text')[document.querySelectorAll('#pageText .line .text').length-1].focus();
                
                save(receivedData);
            }
        });
       
        lineAddEvent();
    }

    // 저장함수
    function save(id){
        console.log("SAVEEEEEEEEEEEEEEEEEEEEEE");
        fetch(API+'/'+id, {
            method: 'PUT',
            body: JSON.stringify({
                title: pageTitle.value,
                content: pageText.innerHTML,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "x-username" : "team7_pages"
            },
        })
        .then((response) => response.json())
        .catch((error)=>{
            console.log(error)
        });
        
        document.getElementById(id).textContent = pageTitle.value;
    }
    

    // 본문에 생성되는 라인
    const textLineCreate = ()=>{
        const line = document.createElement('div');
        const lineSetBtns = `<ul class="lineSetBtns"> 
                                <a class="subPageCreate" href="" title="페이지"><span class="material-symbols-outlined">add</span></a>
                             </ul> 
                            <div class="text" contenteditable="true"></div>`
        line.classList.add('line');
        line.innerHTML = lineSetBtns;

        return line;
    }

    

    // 본문텍스트 커서 위치값 얻기
    function handleSelectionChange(line){
        if (document.activeElement != line) {
            console.log('-',line)
            return console.log(document.activeElement);
        }
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const clonedRange = range.cloneRange();
        clonedRange.selectNodeContents(line);
        clonedRange.setEnd(range.endContainer, range.endOffset);
        
        return position = clonedRange.toString().length;
    };

    // 본문텍스트 라인 이벤트 함수
    function lineAddEvent(){
        let contentArr = [];
        document.addEventListener('keydown',(e)=>{
            let textLine = e.target;
            let linePrev = textLine.parentElement.previousElementSibling;

            if(textLine.classList.contains('text')){
                contentArr = [...textLine.textContent];
                if(e.keyCode == 38){
                    if(handleSelectionChange(textLine) == 0){
                        if(linePrev == null){
                            pageTitle.focus();
                        }else{
                            linePrev.querySelector('.text').focus();
                        }
                    }
                }else if(e.keyCode == 40){
                    if(handleSelectionChange(textLine) == contentArr.length){
                        textLine.parentElement.nextElementSibling.querySelector('.text').focus();
                    }else if(textLine.nextElementSibling !== null || textLine.nextElementSibling !== undefined){
                        textLine.nextElementSibling.focus();
                    }
                }else if(e.keyCode == 13){
                    if(contentArr.length == handleSelectionChange(textLine)){
                        e.preventDefault();
                        textLine.parentElement.after(textLineCreate())
                        textLine.parentElement.nextElementSibling.querySelector('.text').focus();
                    }
                }else if(e.keyCode == 8){
                    // 삭제버튼 클릭시 라인에 아무값도 없으면 해당 라인 삭제 후 위로 포커스
                    if(contentArr.length == 0){
                        textLine.parentElement.remove(); 
                        linePrev.querySelector('.text').focus();
                    }
                }
                
            }

        });
        document.addEventListener('keyup',(e)=>{
            let textLine = e.target;
            if(textLine.classList.contains('text')){
                save(receivedData);
            }
        })
    }
    

    //하위페이지가 생성되고 이동
    document.addEventListener('click',(e)=>{
        
        let subPageCreateBtn = e.target.parentElement;
        if(subPageCreateBtn.classList.contains('subPageCreate')){
            e.preventDefault();
            fetch(API, {
                method: 'POST',
                body: JSON.stringify({
                    title: '',
                    parent: receivedData
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "x-username" : "team7_pages"
                },
            })
            .then((response) => response.json())
            .then((json) => {
                console.log(json["id"])
                subPageCreateBtn.parentElement.parentElement.querySelector('.text').append(subPageCreate(json)); 
                save(receivedData);
                // 하위 페이지 생성 버튼 누르자 마자 하위페이지로 이동
                document.querySelector(`#s${json["id"]}`).click();
                getPageTitleList()
            })

        }
    });
    function subPageCreate(data){
        const subPageLine = document.createElement('a');
        subPageLine.classList.add('subPage');
        subPageLine.href = `/page/${data["id"]}`;
        subPageLine.setAttribute("contenteditable",'false');
        subPageLine.id = "s"+data["id"];
        subPageLine.textContent = data['title'] ==""?"새페이지":data["title"];

        return subPageLine;
    }

    // 문서 트리형식
    const root = document.getElementById("notionList");
    function createTreeView(menu, currentNode) {
        for (let i = 0; i < menu.length; i++) {
            let menuitem = document.createElement("li");
            if (menu[i].documents !== undefined) {
            // // 각 메뉴에 자식 노드가 있으면 
            const a = document.createElement("a");
            a.href="/page/"+menu[i].id;
            a.id=menu[i].id;
            a.textContent = menu[i].title == "" ? "새페이지" : menu[i].title;
            a.classList.add('pageLink');

            const deleteBtn = document.createElement('a');
            deleteBtn.textContent = "삭제";
            deleteBtn.href = "#";
            deleteBtn.classList.add("deletePage");
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm("정말 삭제하시겠습니까?")) { // 사용자에게 확인받기
                    deletePage(menu[i]); // API에서 삭제 요청
                    getPageTitleList();
                }
            });
            // 새로운 list 만들 ul
            // 자식노드의 자식노드 list
            const newul = document.createElement("ul");
            menuitem.append(a, deleteBtn ,newul); // li에 넣어줌
            currentNode.append(menuitem);

            createTreeView(menu[i].documents, newul); // 자식 노드가 있으니까 재귀 한번 더돔
            } else {
            // 메뉴에 자식 노드가 없으면 -> li 엘리먼트 안에 단순히 이름만 표시
            menuitem.textContent = menu[i].title;
            currentNode.append(menuitem);
            // 자식 노드가 없으므로 재귀 돌릴 필요 없음.
            }
        }
    }
    // 페이지 목록 생성
    const getPageTitleList=()=>{
           fetch(API,{
                headers: {
                    "x-username" : "team7_pages"
                },
          })
          .then((response) => response.json())
         // .then((json) => console.log(json));
          .then((json) => {
               notionList.innerHTML="";
               createTreeView(json, root);
          })
    }
});
