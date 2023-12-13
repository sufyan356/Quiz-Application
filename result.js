let quizResultData = JSON.parse(localStorage.getItem("quizResultData")) ;
let getUserScore = quizResultData[quizResultData.length-1].score;
let getQuizLength = quizResultData[quizResultData.length-1].quizLength+1;

let checkPercentages = (getUserScore / (getQuizLength) * 100).toFixed(2);
let correct_answers = document.querySelector("#correct-answers");
let percentage = document.querySelector("#perc");
let comment_result_heading = document.querySelector("#result-comment-heading");
let comment_result = document.querySelector("#result-comment");

percentage.style.fontWeight = "1000"
correct_answers.textContent = `Correct Answers: ${getUserScore}/${getQuizLength}`;
percentage.textContent = `YOURS PERCENTAGE IS: ${checkPercentages}%`

if(checkPercentages >= 60){
  comment_result_heading.innerHTML = "<h3 id ='success' >CONGRATULATIONS! <i class='fa-solid fa-circle-check fa-beat'></i></h3>"
  comment_result.innerHTML = "<h3 class = resultComment>You have successfully Passed Exam</h3>"
}
else{
  comment_result_heading.innerHTML = "<h3 id ='fail'>FAILED! <i class='fa-solid fa-circle-exclamation fa-beat'></i></h3>"
  comment_result.innerHTML = "<h3 class = resultComment> You must study harder </h3>"
}