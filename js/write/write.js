document.addEventListener("DOMContentLoaded",()=>{
    
    let pageHistory = [];
    let pageHistoryNum = 0;
    let pageTitle;
    let pageText;
    let lineList;
    let receivedData;// 현재 글 쓰그 있는 페이지 id 값

    const main = document.querySelector('main');

    const routes = {
        "/page" : "./pages/page.html"
    };
    // 페이지를 변경하는 함수
    function router(event) {
        event.preventDefault();

        const href = event.target.getAttribute("href");

        window.history.pushState({ path: href }, "", href);
        handleLocation();
        routerAfter();
    }
    
   // 경로에 따라 페이지 변경
   async function handleLocation() {
     const pathname = window.location.pathname;
     const route = routes[pathname];
     if (pathname === "/page") {
        if (route) {
            const data = await (await fetch(route)).text();
            document.querySelector("main").innerHTML = data;
            pageHistory[pageHistoryNum] = receivedData;
            console.log(pageHistory,pageHistoryNum);
        }
     }
   }


    // href가 /page인 버튼 누르면 해당 페이지 생성
    document.addEventListener('click',(e)=>{
        let textLine = e.target;
        let linePrev = textLine.parentElement.previousElementSibling;
        pageHistoryNum++;
        if(textLine.getAttribute('href') == "/page"){
          console.log("1",e.target)
          e.preventDefault();
          e.target.addEventListener("click", router(e));

        receivedData = e.target.id;  // id 대신 a 태그 안의 텍스트 가져오기
        receivedContent = e.target.textContent; 
        tabTitle.textContent = receivedContent; // tabTitle에 적용
        //   routerAfter();
        }

    });

    // 뒤로가기가 눌리면
    window.addEventListener("popstate",(e)=>{
        console.log(e);
        if(pageHistoryNum > 0){
            pageHistoryNum--;
            receivedData = pageHistory[pageHistoryNum];
            routerAfter();
        }
    });
    // 앞으로가기 안댐
    // window.addEventListener("pushstate",(e)=>{
    //     pageHistoryNum++
    //     receivedData = pageHistory[pageHistoryNum];
    //     routerAfter();
    // });
    function routerAfter(){

        setTimeout(()=>{
            pageTitle = main.querySelector('#pageTitle');
            pageText = main.querySelector('#pageText');
            lineList = main.querySelectorAll('#pageText .line .text');

            // 페이지 시작시 pageTitle에 focus
            pageTitle.focus();
            getPage();
            lineAddEvent();

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
                save();
            });
            // 본문 백그라운드 클릭시 라인 추가
            pageText.addEventListener('click',(e)=>{
                if(e.target.id === "pageText"){
                    e.currentTarget.append(textLineCreate());
                    // 생성된 마지막 요소에 포커스
                    main.querySelectorAll('#pageText .line .text')[document.querySelectorAll('#pageText .line .text').length-1].focus();
                    save();
                }
            });

        },100)
    }
    
     
    // API에 PUT
    const API = 'https://kdt-api.fe.dev-cos.com/documents';
    // 페이지 가져오기 함수
    const getPage=()=>{
        fetch(API+"/"+receivedData,{
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
        })
    }
    

    // 페이지 셋팅 함수
    const setPage =(data) =>{
        const prePageText = document.createElement("p")
        pageTitle.value=data['title'];
        // pageText.innerHTML=data['content'];
        prePageText.innerHTML=data['content'];
    
        const subPages = prePageText.querySelectorAll('.subPage');
        if(subPages.length !== 0){
            //서브페이지가 존재하면 이름 바꿔주기
            subPages.forEach((page,i)=>{
                fetch(API+"/"+page.id,{
                    headers: {
                        "x-username" : "team7_pages"
                    }
                })
                .then((response) => {
                    if (!response.ok) {
                        throw page.remove();
                    }
                    return response.json()
                })
                .then((data) => {
                    data["title"]==="" ? "새페이지" : page.textContent=data["title"];
                })
                .then(()=>{
                    pageText.innerHTML = prePageText.innerHTML;
                })       
            });
        }else{
            pageText.innerHTML = prePageText.innerHTML;   
        }
    }

    // 저장함수
    function save(){
        fetch(API+'/'+receivedData, {
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

        document.getElementById(receivedData).textContent = pageTitle.value;
    }
    

    // 본문에 생성되는 라인
    const textLineCreate = ()=>{
        const line = document.createElement('div');
        const lineSetBtns = `<ul class="lineSetBtns"> 
                                <a class="subPageCreate" href="#" title="페이지"><span class="material-symbols-outlined">add</span></a>
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
                save();
            }
        })
    }
    

    //하위페이지 이름 바뀌는 기능
    document.addEventListener('click',(e)=>{
        
        let subPageCreateBtn = e.target.parentElement;
        if(subPageCreateBtn.classList.contains('subPageCreate')){
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
                subPageCreateBtn.parentElement.parentElement.querySelector('.text').append(subPageCreate(json)); 
                save();
                // 하위 페이지 생성 버튼 누르자 마자 하위페이지로 이동
                receivedData = json["id"];
                // routerAfter();
            })

        }
    });
    function subPageCreate(data){
        const subPageLine = document.createElement('a');
        subPageLine.classList.add('subPage');
        subPageLine.href = "/page";
        subPageLine.setAttribute("contenteditable",'false');
        subPageLine.id = data["id"];
        subPageLine.textContent = data['title'] ==""?"새페이지":data["title"];
        subPageLine.addEventListener('click',(e)=>{
            e.preventDefault();
        });
       
        return subPageLine;
    }


});
