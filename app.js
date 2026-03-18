const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzl7pPEibKFU-jxWcYrNk79jwLWab9pfz6dv2_O_B4t1nxYW1py62_xtyynSNE37K3Y/exec';

document.getElementById('quizForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "채점 중";
    submitBtn.disabled = true;

    let score = 0;
    let wrongQuestions = []; 
    let userAnswers = {};   

    let uid = localStorage.getItem('quiz_uid');
    if (!uid) {
        uid = "ID_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('quiz_uid', uid);
    }

    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const userName = document.getElementById('username').value;
    const department = document.getElementById('department').value; 
    const role = document.getElementById('role').value; 


    const checkRadio = (qNum, name, answer) => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        userAnswers[`ans${qNum}`] = checked ? checked.value : "미입력";
        if (checked && checked.value === answer) {
            score += 10;
        } else {
            wrongQuestions.push(qNum);
        }
    };


    const q1_raw_inputs = [
        document.getElementById('q1_in_1').value, document.getElementById('q1_in_2').value,
        document.getElementById('q1_in_3').value, document.getElementById('q1_in_4').value, document.getElementById('q1_in_5').value
    ];
    userAnswers.ans1 = q1_raw_inputs.join(", "); 
    const q1_inputs = q1_raw_inputs.map(val => val.replace(/\s+/g, '').toLowerCase());

    // 
    const q1_concept_groups = [
        ["비상조치계획서"], 
        ["위험평가서", "위험성평가서"],
        ["작업절차서"],             
        ["작업허가서"],                          
        ["보호구착용기준서"]
    ];

    let q1_matchCount = 0;
    q1_concept_groups.forEach(group => {
        const foundIndex = q1_inputs.findIndex(input => 
            group.some(synonym => input.includes(synonym))
        );
        if (foundIndex !== -1) {
            q1_matchCount++; 
            q1_inputs[foundIndex] = ""; // 중복 방지
        }
    });
    if (q1_matchCount === 5) { score += 10; } 
    else { wrongQuestions.push(1); }

    // 
    checkRadio(2, "q2", "1"); 
    checkRadio(3, "q3", "4"); 


    const q4_raw_1 = document.getElementById('q4_in_1').value;
    const q4_raw_2 = document.getElementById('q4_in_2').value;
    userAnswers.ans4 = `명칭:${q4_raw_1}, 교체주기:${q4_raw_2}`;
    
    const q4_1_answers = ["정화통", "필터", "정화통(필터)", "6006K"]; 
    const q4_2_answers = ["6개월"]; 

    const q4_1_isCorrect = q4_1_answers.some(ans => q4_1.includes(ans));
    const q4_2_isCorrect = q4_2_answers.some(ans => q4_2.includes(ans));

    if (q4_1_isCorrect && q4_2_isCorrect) { 
        score += 10; 
    } else { 
        wrongQuestions.push(4); 
    }

    checkRadio(5, "q5", "4"); 
    checkRadio(6, "q6", "4"); 
    checkRadio(7, "q7", "3"); 



    const q8_raw_1 = document.getElementById('q8_in_1').value;
    const q8_raw_2 = document.getElementById('q8_in_2').value;
    const q8_raw_3 = document.getElementById('q8_in_3').value;
    const q8_raw_4 = document.getElementById('q8_in_4').value;
    userAnswers.ans8 = `안전모:${q8_raw_1}, 벨트:${q8_raw_2}, 안전화:${q8_raw_3}, 보안경:${q8_raw_4}`;
    
    const q8_1 = q8_raw_1.replace(/\s+/g, '').toLowerCase();
    const q8_2 = q8_raw_2.replace(/\s+/g, '').toLowerCase();
    const q8_3 = q8_raw_3.replace(/\s+/g, '').toLowerCase();
    const q8_4 = q8_raw_4.replace(/\s+/g, '').toLowerCase();

    if (
        q8_1.includes("머리") &&  
        q8_2.includes("몸") &&  
        q8_3.includes("발") &&    
        q8_4.includes("눈")      
    ) { 
        score += 10; 
    } else { 
        wrongQuestions.push(8); 
    }


    checkRadio(9, "q9", "4"); 


    const q10_raw_1 = document.getElementById('q10_in_1').value;
    const q10_raw_2 = document.getElementById('q10_in_2').value;
    userAnswers.ans10 = `3정:${q10_raw_1}, 5S:${q10_raw_2}`;
    
    const q10_1 = q10_raw_1.replace(/\s+/g, '').toLowerCase();
    const q10_2 = q10_raw_2.replace(/\s+/g, '').toLowerCase();

    const is3JongCorrect = q10_1.includes("정품") && 
                           q10_1.includes("정량") && 
                           q10_1.includes("정위치");

    const is5SCorrect = q10_2.includes("정리") && 
                        q10_2.includes("정돈") && 
                        q10_2.includes("청소") && 
                        q10_2.includes("청결") && 
                        (q10_2.includes("생활화") || q10_2.includes("습관화"));

    if (is3JongCorrect && is5SCorrect) { 
        score += 10; 
    } else { 
        wrongQuestions.push(10); 
    }

   
  
    const payload = {
        name: userName,
        department: department, 
        role: role, 
        score: score,
        time: timeString,
        uid: uid,
        wrongQs: wrongQuestions.join(", "), 
        ans1: userAnswers.ans1, ans2: userAnswers.ans2, ans3: userAnswers.ans3,
        ans4: userAnswers.ans4, ans5: userAnswers.ans5, ans6: userAnswers.ans6,
        ans7: userAnswers.ans7, ans8: userAnswers.ans8, ans9: userAnswers.ans9, ans10: userAnswers.ans10
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("구글 시트 전송 중 오류 발생:", error);
    }

    // 결과 화면 노출 및 처리
    document.getElementById('scoreDisplay').innerText = score;
    document.getElementById('resultMessage').classList.remove('hidden');

    if (score >= 80) {
        alert(`합격입니다! 제출이 완료되었습니다.\n\n(최종 점수: ${score}점)`);
        submitBtn.innerText = "제출 완료";
        submitBtn.style.backgroundColor = "#999"; 
        submitBtn.style.cursor = "not-allowed";
    } else {
        alert(`불합격입니다.\n\n현재 점수: ${score}점\n\n80점 미만이므로 재응시해야 합니다.`);
        submitBtn.innerText = "제출하기"; 
        submitBtn.disabled = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});