
let question_answer = document.querySelector('.question-answer');
let NumOfCurrentQuestion = document.querySelector('.NumOfCurrentQuestion');
let TotalQuestion = document.querySelector('.TotalQuestion');
let prev = document.querySelector('.prev');
let next = document.querySelector('.next');
let submit = document.querySelector('.submit');
let examForm = document.querySelector('.examForm');
let Time_Remaining = document.querySelector('.Time_Remaining');


let counter = 0;

class Exam {

    constructor(questionArray, duration) {
        this.questionArray = questionArray;
        this.duration = duration
    }
    //////////////////Start Exam/////////////////////
    async start() {
        try {
            const response = await fetch('http://localhost:3000/arrayQuestion')
            this.questionArray = await response.json();
            return this.questionArray;
        }
        catch (error) {
            console.log("ERROR with catch", error);
        }
    }
    ///////////////////////////Next//////////////////////
    next() {
        let maxPage = this.questionArray.length - 1;
        if (counter < maxPage) {
            counter++;
            renderData()
        }
        else {
            next.style.backgroundColor = 'rgba(147, 147, 147, 0.125)'
            next.style.cursor = "not-allowed;"
        }
    }
    ///////////////////////Previous///////////////////////
    prev() {

        if (counter > 0) {
            counter--;
            renderData()
        }
        // else{
        // //    next.style.backgroundColor='rgba(147, 147, 147, 0.125)'  
        //    next.style.cssText=`
        //         cursor: none;
        //         background-color: rgba(147, 147, 147, 0.125)
        //    `     
        // }
    }
    ///////////////////////////Submit Exam///////////////////////////////
    async submitExam(FetchQuestion) {
        question_answer.innerHTML = ''
        let UserName = JSON.parse(localStorage.getItem('User_Name'));
        let AnswerStorage = JSON.parse(localStorage.getItem('Choose_Answer')) || [];
        //  console.log(AnswerStorage[0].id)
        let countCorrectAnswer = 0;

        for (let index = 0; index < FetchQuestion.length; index++) {
            for (let index2 = 0; index2 < AnswerStorage.length; index2++) {
                if (FetchQuestion[index].id == Number(AnswerStorage[index2].id)) {
                    if (FetchQuestion[index].correctAnswer === AnswerStorage[index2].answer) {
                        countCorrectAnswer++;
                        console.log(countCorrectAnswer);
                        break;
                    }
                }
            }

        }
        ///////////////fun: To Calculate Grade//////////////////
        function grade(score, total) {
            let precentage = Math.ceil((score / total) * 100)
            if (precentage > 90) {
                return "Excelent"
            }
            else if (precentage >= 80) {
                return "Very Good"
            }
            else if (precentage >= 60) {
                return "Good"
            }
            else {
                return "Please Try Again "
            }
        }
        examForm.innerHTML = `
                 <div class="score">
                    <h3><span class="Grade">Thanks</span> <span class="userName">${UserName}</span></h3>
                    <p class="final_Score">final score is: ${countCorrectAnswer} / ${FetchQuestion.length}</p>
                    <p class="grade">${grade(countCorrectAnswer, FetchQuestion.length)}</p>
                 </div>
                `
        localStorage.removeItem('Choose_Answer');
        localStorage.removeItem('User_Name');

    }
    ////////////////////////////////////Duration//////////////////////////////
    async Duration(arrFetched) {
        this.duration = 120;
        let count = 60;
        let time = setInterval(() => {
            if (this.duration > 0) {
                this.duration--;
                if (this.duration < 120 && this.duration > 59) {
                    count--;
                    Time_Remaining.innerHTML = `Timing Remaining for Exam close: 1 minite : ${count} second`;
                    Time_Remaining.style.color = 'rgb(27, 85, 65)';
                    if (count == 1) {
                        count = 59
                    }

                }
                else if (this.duration < 59 && this.duration > 0) {
                    count--;
                    Time_Remaining.innerHTML = `Timing Remaining for Exam close: 0 minite : ${count} second`;
                    if (this.duration < 20) {
                        Time_Remaining.style.color = 'rgb(170, 38, 38)';
                        // alert('The Time Remaining is: 20 second')
                    }
                }

            }
            else {
                clearInterval(time);
                Time_Remaining.innerHTML = `Timing Remaining for Exam close: 0 minite : 0 second`;
                alert('Time of Exam Finished')
                this.submitExam(arrFetched)
            }
        }, 1000);
        return time;
    }
}

let exam = new Exam();
let fetched = await exam.start();
// console.log(fetched);
////////////////////////show first question////////////////////////////
await exam.Duration(fetched)
NumOfCurrentQuestion.innerHTML = 1;
TotalQuestion.innerHTML = fetched.length;
question_answer.innerHTML = `
             <div class="inner" data-id=${fetched[0].id}>
                    <p><span>${fetched[0].id} :  </span> <span>${fetched[0].question}</span></p>
                    <p>
                        <ul>
                            <li class="answer">${fetched[0].options[0]}</li><br>
                            <li class="answer">${fetched[0].options[1]}</li><br>
                            <li class="answer">${fetched[0].options[2]}</li><br>
                            <li class="answer">${fetched[0].options[3]}</li><br>
                        </ul>
                    </p>
                    <br> 
             </div> `

/////////////////////previous btn//////////////////////
prev.addEventListener('click', () => {
    exam.prev();
})

/////////////////////next btn/////////////////////////
next.addEventListener('click', () => {
    exam.next();
})

//////////////////////Choose Answer//////////////////
question_answer.addEventListener('click', (e) => {
    if (e.target.classList.contains('answer')) {
        // console.log(e)
        let questionParent = e.target.closest('.inner')
        // let AnswerId = e.target.parentElement.parentElement.dataset.id;
        let AnswerId = questionParent.dataset.id;
        // console.log(AnswerId)
        let selsectAnswer = questionParent.querySelectorAll('.answer')
        selsectAnswer.forEach(option => {
            option.classList.remove('selected');
            option.style.backgroundColor = '';
        });
        e.target.classList.add('selected');
        e.target.style.backgroundColor = 'rgba(0, 99, 119, 0.748)';


        let arrStorage = JSON.parse(localStorage.getItem('Choose_Answer')) || [];
        // console.log(arrStorage)
        let existingQuestion = arrStorage.find(item => item.id === AnswerId);
        //   console.log(existingQuestion)
        if (existingQuestion) {
            ///////// Update///////
            //   console.log(existingQuestion.answer)
            existingQuestion.answer = e.target.innerHTML;
            //   console.log(existingQuestion)
        }
        else {
            /////// Add new Answer ////////
            arrStorage.push({
                id: AnswerId,
                answer: e.target.innerHTML
            });
        }
      
        localStorage.setItem("Choose_Answer", JSON.stringify(arrStorage));
    }

})

//////////////////////Submit btn///////////////////////////////
submit.addEventListener('click', async () => {
    await exam.submitExam(fetched);
})

//////////////////////show Question///////////////////
function oneQuestion(arrFetched) {
    question_answer.innerHTML = ' '; 4
    let arrStorage = JSON.parse(localStorage.getItem('Choose_Answer')) || [];
    for (let index = 0; index < arrFetched.length; index++) {
        question_answer.innerHTML += `
                <div class="inner" data-id=${arrFetched[index].id}>
                    <p><span>${arrFetched[index].id} :  </span> <span>${arrFetched[index].question}</span></p>
                    <p>
                        <ul>
                            <li class="answer">${arrFetched[index].options[0]}</li><br>
                            <li class="answer">${arrFetched[index].options[1]}</li><br>
                            <li class="answer">${arrFetched[index].options[2]}</li><br>
                            <li class="answer">${arrFetched[index].options[3]}</li><br>
                        </ul>
                    </p>
                    <br> 
               </div> `
        let Find_Answer_stored = arrStorage.find(elm => String(elm.id) === String(arrFetched[index].id));
        if (Find_Answer_stored) {
            let Options = question_answer.querySelectorAll(`.inner[data-id="${arrFetched[index].id}"] .answer`);
            Options.forEach(option => {
                if (option.innerHTML === Find_Answer_stored.answer) {
                    option.classList.add('selected');
                    option.style.backgroundColor = 'rgba(0, 99, 119, 0.748)';

                }
            });
        }

    }
}

/////////////////////slice page question ////////////////////////
function renderData() {
    //  oneQuestion(fetched);
    let start = counter * 1;
    let end = start + 1;

    NumOfCurrentQuestion.innerHTML = start + 1;
    TotalQuestion.innerHTML = fetched.length;

    let prePage = fetched.slice(start, end);
    oneQuestion(prePage);

}