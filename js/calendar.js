export function CalendarEventsBind() {
    const calendarDates = document.getElementById("calendarDates");
    const currentMonthElement = document.getElementById("currentMonth");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let selectedDate = null; 
    let selectedDocId = null;
    
    async function renderCalendar() {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();

        try {
            const viewCalendarApi = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "7team calendar",
                },
            });

            if (!viewCalendarApi.ok) {
                const errorText = await viewCalendarApi.text();
                console.error("달력 불러오기 실패:", errorText);
                alert("달력 불러오기 실패: " + errorText);
                return;
            }
            const viewCalendar = await viewCalendarApi.json();

            currentMonthElement.textContent = `${currentYear}년 ${currentMonth + 1}월`;
            calendarDates.innerHTML = "";

            for (let i = 0; i < startDayOfWeek; i++) {
                const emptyDate = document.createElement("div");
                emptyDate.classList.add("date", "empty");
                calendarDates.appendChild(emptyDate);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const dateElement = document.createElement("div");
                dateElement.classList.add("date");
                dateElement.textContent = i;

                const dateString =
                    String(currentYear) +
                    "-" +
                    String(currentMonth + 1).padStart(2, "0") +
                    "-" +
                    String(i).padStart(2, "0");

                dateElement.dataset.value = dateString;

                const matchingCalendar = viewCalendar.filter((list) => list.title === dateString);
                matchingCalendar.forEach((daylist) => {
                    if (daylist.documents.length > 0) {
                        daylist.documents.forEach((child) => {
                            const div = document.createElement("div");
                            div.dataset.id = child.id;
                            div.dataset.date = dateString;
                            div.classList.add("popupView");
                            div.id = "popupView";
                            div.textContent = child.title;
                            div.style.color = "#333";
                            div.style.backgroundColor = "#e0f6ff";
                            // div.style.boxShadow = "1px 1px 10px rgba(0, 0, 0, 0.3), -1px -1px 10px rgba(0, 0, 0, 0.3)";
                            div.style.border = "1px solid #b4eaff";
                            div.style.borderRadius = "5px";
                            div.style.margin = "3px";
                            dateElement.appendChild(div);
                        });
                    }
                });
                calendarDates.appendChild(dateElement);
            }
        } catch (err) {
            console.error("달력 에러:", err);
            alert("달력 에러");
        }
    }

    renderCalendar();

    prevBtn.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    //레이어 팝업 닫기
    document.getElementById("close-popup").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    //레이어 팝업 열기
    calendarDates.addEventListener("click", async (e) => {
        //입력	
        document.getElementById("calendar-title").value = "";  
        document.getElementById("calendar-content").value = "";

        const insertBtn = document.getElementById("insert-btn");
        const updateBtn = document.getElementById("update-btn");
        const deleteBtn = document.getElementById("delete-btn");
        const mainDarkMode = document.querySelector('main');
        
        if (e.target.classList.contains("date") && e.target.dataset.value) {
            selectedDate = e.target.dataset.value;
            document.getElementById("selected-date").textContent = selectedDate /*+ "일"*/;
            document.getElementById("popup").style.display = "flex";
            insertBtn.style.display = "inline-block";
            updateBtn.style.display = "none";
            deleteBtn.style.display = "none";
            return;
        }

        //상세
        if (e.target.classList.contains("popupView")) {
            const docId = e.target.dataset.id;
            
            selectedDate = e.target.parentElement.dataset.value;
            selectedDocId = e.target.dataset.id;
            try {
                const popupViewApi = await fetch("https://kdt-api.fe.dev-cos.com/documents/" + docId, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-username": "7team calendar",
                    },
                });

                if (!popupViewApi.ok) {
                    const errorText = await popupViewApi.text();
                    console.error("팝업 불러오기 실패:", errorText);
                    alert("팝업 불러오기 실패: " + errorText);
                    return;
                }
                
                const view = await popupViewApi.json();
                document.getElementById("selected-date").textContent = selectedDate /*+ "일"*/;
                document.getElementById("calendar-title").value = view.title;
                document.getElementById("calendar-content").value = view.content;
                document.getElementById("popup").style.display = "flex";
                if (mainDarkMode.classList.contains('dark-mode')) {
                    insertBtn.style.display = "none";
                    updateBtn.style.display = "inline-block";
                    updateBtn.style.backgroundColor = "#1e1d28";
                    updateBtn.style.color = "#fff";
                    deleteBtn.style.display = "inline-block";
                    deleteBtn.style.backgroundColor = "#1e1d28";
                    deleteBtn.style.color = "#fff";
                }else{
                    insertBtn.style.display = "none";
                    updateBtn.style.display = "inline-block";
                    updateBtn.style.backgroundColor = "#fff";
                    updateBtn.style.color = "#1e1d28";
                    deleteBtn.style.display = "inline-block";
                    deleteBtn.style.backgroundColor = "#fff";
                    deleteBtn.style.color = "#1e1d28";
                }
            } catch (err) {
                console.error("팝업 에러:", err);
                alert("팝업 에러");
            }
        }
    });

    // 저장
    document.getElementById("insert-btn").addEventListener("click", async () => {
        const title = document.getElementById("calendar-title");
        const content = document.getElementById("calendar-content");
        const cleanDate = selectedDate;
        
        if(!title.value){
            alert("제목을 입력해주세요!");
            title.focus();
            return;
        }
        if(!content.value){
            alert("내용을 입력해주세요!");
            content.focus();
            return;
        }

        try {
            const documentCreateApi = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "7team calendar",
                },
                body: JSON.stringify({
                    title: cleanDate,
                    parent: cleanDate,
                }),
            });

            if (!documentCreateApi.ok) {
                const errorText = await documentCreateApi.text();
                console.error("Doc 저장 실패:", errorText);
                alert("Doc 저장 실패: " + errorText);
                return;
            }

            const CreateDoc = await documentCreateApi.json();

            const documentTreeCreateApi = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "7team calendar",
                },
                body: JSON.stringify({
                    title: title.value,
                    parent: CreateDoc.id,
                }),
            });

            if (!documentTreeCreateApi.ok) {
                const errorText = await documentTreeCreateApi.text();
                console.error("Tree 저장 실패:", errorText);
                alert("Tree 저장 실패: " + errorText);
                return;
            }

            const CreateTreeDoc = await documentTreeCreateApi.json();

            const scheduleInfoApi = await fetch("https://kdt-api.fe.dev-cos.com/documents/" + CreateTreeDoc.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "7team calendar",
                },
                body: JSON.stringify({
                    title: title.value,
                    content: content.value,
                }),
            });

            if (!scheduleInfoApi.ok) {
                const errorText = await scheduleInfoApi.text();
                console.error("일정 저장 실패:", errorText);
                alert("일정 저장 실패: " + errorText);
                return;
            }
            document.getElementById("popup").style.display = "none";
            alert("일정이 저장되었습니다!");
            await renderCalendar();
        } catch (err) {
            console.error("저장 에러:", err);
            alert("저장 에러");
        }
    });

    //수정
    document.getElementById("update-btn").addEventListener("click", async () => {
        const docId = selectedDocId;
        const title = document.getElementById("calendar-title");
        const content = document.getElementById("calendar-content");

        if(!title.value){
            alert("제목을 입력해주세요!");
            title.focus();
            return;
        }
        if(!content.value){
            alert("내용을 입력해주세요!");
            content.focus();
            return;
        }

        try {
            const updateApi = await fetch("https://kdt-api.fe.dev-cos.com/documents/" + docId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "7team calendar",
                },
                body: JSON.stringify({
                    title: title.value,
                    content: content.value,
                }),
            });

            if (!updateApi.ok) {
                const errorText = await updateApi.text();
                console.error("수정 실패:", errorText);
                alert("수정 실패: " + errorText);
                return;
            }

            document.getElementById("popup").style.display = "none";
            alert("일정이 수정되었습니다!");
            await renderCalendar();
        } catch (err) {
            console.error("수정 에러:", err);
            alert("수정 에러");
        }
    });

    //삭제
    document.getElementById("delete-btn").addEventListener("click", async () => {
        const docId = selectedDocId;
        try {
            const deleteApi = await fetch("https://kdt-api.fe.dev-cos.com/documents/" + docId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "7team calendar",
                },
            });

            if (!deleteApi.ok) {
                const errorText = await deleteApi.text();
                console.error("삭제 실패:", errorText);
                alert("삭제 실패: " + errorText);
                return;
            }

            document.getElementById("popup").style.display = "none";
            alert("일정이 삭제되었습니다!");
            await renderCalendar();
        } catch (err) {
            console.error("삭제 에러:", err);
            alert("삭제 에러");
        }
    });
}