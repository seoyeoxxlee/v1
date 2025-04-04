document.addEventListener("DOMContentLoaded",()=>{
    // API
    const API = 'https://kdt-api.fe.dev-cos.com/documents';
    const pageCreateButton = document.getElementById('pageCreateButton');
        pageCreateButton.addEventListener('click',(event)=>{
            fetch(API, {
                method: 'POST',
                body: JSON.stringify({
                    title:'',
                    parent: null
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "x-username" : "team7_pages"
                },
            })
            .then((response) => response.json())
            .then((json) => makePageTitle(json))
        });

        // 문서 트리형식
        function treeList(data){    
            const deleteBtn = document.createElement('a');
            deleteBtn.textContent = "삭제";
            deleteBtn.href = "#";
            deleteBtn.classList.add("deletePage");
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm("정말 삭제하시겠습니까?")) { // 사용자에게 확인받기
                    deletePage(data); // API에서 삭제 요청
                    e.target.parentElement.remove(); // 화면에서 제거
                }
            });

            // 동작 부분
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            const a = document.createElement('a');
            const sub = data["documents"];

            a.href ='/page';
            a.id = data["id"];
            a.textContent= data['title'] ==""?"새페이지":data["title"];
            li.append(a);
            li.append(deleteBtn);

            if(sub.length != 0){
                sub.forEach((el)=>{
                    const li2 = document.createElement('li');
                    const a2 = document.createElement('a');
                    const deleteBtn2 = document.createElement('a');
                    deleteBtn2.textContent = "삭제";
                    deleteBtn2.href = "#";
                    deleteBtn2.classList.add("deletePage");
                    deleteBtn2.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (confirm("정말 삭제하시겠습니까?")) { // 사용자에게 확인받기
                            deletePage(el); // API에서 삭제 요청
                            e.target.parentElement.remove(); // 화면에서 제거
                        }
                    });
                    
                    a2.href ='/page';
                    a2.id = el["id"];
                    a2.textContent= el['title'] ==""?"새페이지":el["title"];
                    li2.append(a2);
                    li2.append(deleteBtn2);
                    ul.append(li2);
                });
                li.append(ul);
            }

            notionList.append(li);
        }
        
        //페이지 만들기
        const notionList = document.getElementById('notionList');
        const makePageTitle = (data) =>{
             const li = document.createElement('li');
             const a = document.createElement('a');
             const sub = data["documents"];
            
             a.href ='/page';
             //고유 아이디로 링크아이디 설정
             a.id = data["id"];
             //페이지의 제목이 빈 문자열인경우 새페이지로 표현
             //제목이 있는경우 제목으로표현
             a.textContent= data['title'] ==""?"새페이지":data["title"];
             li.appendChild(a);
             
            const deleteBtn = document.createElement('a');
            deleteBtn.textContent = "삭제";
            deleteBtn.href = "#";
            deleteBtn.classList.add("deletePage");
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
            
                if (confirm("정말 삭제하시겠습니까?")) { // 사용자에게 확인받기
                    deletePage(data); // API에서 삭제 요청
                    e.target.parentElement.remove(); // 화면에서 제거
                }
            });
            
            li.append(deleteBtn);
            notionList.appendChild(li);
            a.click();
            
        };

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
                    json.forEach(
                        (data) =>{
                            treeList(data)
                        }
                    )
                    //목록중 첫번째 페이지 내용을 보여줌
                    // setContents(json[0]);
              })
        }
        getPageTitleList();

        // 삭제버튼
        function deletePage(data){
            fetch(API+"/"+data["id"], {
                method: 'DELETE',
                headers: {
                    "x-username" : "team7_pages"
                },
            })
            .then((response) => {
                    if (!response.ok) {
                        throw new Error("삭제 실패!");
                    }
                    console.log(`페이지 ${data.id} 삭제 완료`);
                })
                .catch((error) => {
                    console.error("삭제 중 오류 발생:", error);
                });
        }

        //목록에서 페이지를 선택 했을때 내용 불러오기
        const pageId = document.getElementById('pageId');
        const contentTitle = document.getElementById("contentTitle");
        const contentBody = document.getElementById("contentBody");

        

        const setContents =(data) =>{
            pageId.textContent =data['id'];
            contentTitle.innerHTML=data['title'];
            contentBody.innerHTML=data['body']

            //상단바에 현재 페이지명 뜨게
            const tabTitle = document.getElementById("tabTitle");

            
            
            // 계층 구조를 대비한 경로 생성 함수
            function getFullPath(page) {
              let path = [];
              
              // 하위 페이지가 없더라도, 향후 parent가 추가될 가능성을 고려
              while (page) {
                path.unshift(page.title || "새페이지");
                page = page.parent || null;  // parent가 없으면 종료
              }
              
              return path.join(" > ");
            }
            
            tabTitle.textContent = getFullPath(data);
            

            //컨텐츠가 변경이되면 기존  history 클리어
            history.back=[];
            history.forward=[];
        }

        //제목 엔터키 막음
        // contentTitle.addEventListener('keydown',(event)=>{
        //    // console.log(event)
        //    if(event.keyCode == 13){
        //     event.preventDefault();
        //    }
        // })

        //저장
        // const pageSaveButton= document.getElementById('pageSaveButton');
            // pageSaveButton.addEventListener('click',(event)=>{

            //     if(confirm('저장하시겠습니까?')){
            //         fetch('http://localhost:3000/posts/'+ pageId.textContent, {
            //                 method: 'PUT',
            //                 body: JSON.stringify({
                               
            //                     title: contentTitle.innerHTML,
            //                     body: contentBody.innerHTML,
                               
            //                 }),
            //                 headers: {
            //                     'Content-type': 'application/json; charset=UTF-8',
            //                 },
            //                 })
            //                 .then((response) => response.json())
            //                 .then((json) =>{
            //                     notionList.querySelector("a[id='"+pageId.textContent+"']").textContent= contentTitle.innerHTML;
            //                     alert('저장되었습니다')
            //                 })
            //         }
            //     })


                //내용에서 엔터키를 누를때마다 히스토리에 저장  LIFO : last in first out
                // const history = {
                //     'back':[],
                //     'forward':[]
                // }
                // contentBody.addEventListener('keydown',(event)=>{
                //     if(event.keyCode == 13){
                //         //엔터키를 누를때 forward가 남았으면 클리어 
                //          if(history.forward.length > 0){
                //             history.forward=[]
                //          }
                         
                //         history.back.push(event.currentTarget.innerHTML);
                //        // console.log(history)
                //     }
                // })

                // const historyBakButton = document.getElementById('historyBakButton');
                // historyBakButton.addEventListener('click',(event)=>{
                //     if(history.back.length == 0){
                //         return;
                //     }
                //     history.forward.push(contentBody.innerHTML);
                //     contentBody.innerHTML= history.back.pop();
                //     //console.log(history)
                // })

                // const historyForwardButton = document.getElementById('historyForwardButton');
                // historyForwardButton.addEventListener('click',(event) =>{
                //     if(history.forward.length == 0){
                //         return;
                //     }
                //     history.back.push(contentBody.innerHTML);
                //     contentBody.innerHTML= history.forward.pop();
                // })


//검색 기능

const searchInput = document.querySelector(".search");
const searchModal = document.getElementById("searchModal");
const searchResults = document.getElementById("searchResults");
const closeBtn = document.querySelector(".close");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        performSearch(query);
    } else {
        searchResults.innerHTML = "";
        searchModal.style.display = "none";
    }
});

closeBtn.addEventListener("click", () => {
    searchModal.style.display = "none";
});

function performSearch(query) {
    const API_URL = "https://kdt-api.fe.dev-cos.com/documents"; // 올바른 API URL

    fetch(API_URL, {
        headers: {
            "x-username": "team7_pages"
        }
    })
    .then(response => response.json())
    .then(pages => {
        let results = [];

        pages.forEach(page => {
            const pageTitle = page.title ? page.title.trim() : "";
            const content = page.body ? page.body.trim() : "";

            if (pageTitle.includes(query) || content.includes(query)) {
                results.push({
                    title: pageTitle,
                    id: page.id,
                    isTitleMatch: pageTitle.includes(query)
                });
            }
        });

        showSearchResults(results, query);
    })
    .catch(error => console.error("검색 중 오류 발생:", error));
}

function showSearchResults(results, query) {
    searchResults.innerHTML = "";

    if (results.length === 0) {
        searchResults.innerHTML = "<li>검색 결과 없음</li>";
    } else {
        results.forEach(result => {
            const li = document.createElement("li");
            const highlightedTitle = result.title.replace(
                new RegExp(query, "gi"),
                (match) => `<mark>${match}</mark>`
            );

            li.innerHTML = `<strong>${highlightedTitle}</strong>`;
            li.addEventListener("click", () => {
                window.location.href = `/page/${result.id}`; // 페이지 이동
            });

            searchResults.appendChild(li);
        });
    }

    searchModal.style.display = "block";
}

})
