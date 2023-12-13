let quizResultData = JSON.parse(localStorage.getItem("quizResultData")) ;
let getUserScore = quizResultData[quizResultData.length-1].score;
let getQuizLength = quizResultData[quizResultData.length-1].quizLength+1;
let table = document.querySelector(".table");
let usersData = JSON.parse(localStorage.getItem("users")) || [];
let latestUserID = JSON.parse(localStorage.getItem("latestUserID"));
let userQuizResult = quizResultData.filter(ele => {
console.log(ele.userID)
    return ele.userID === latestUserID
});
    
userQuizResult.forEach((ele , index ) => {
table.innerHTML += `
  <tbody class="tbody">
    <tr>
      <th scope="row">${(++index)}</th>
      <td id="QuizAttendDate&Time">${ele.dateFormat}</td>
      <td id="quizSubject">${ele.quizName}</td>
      <td id="quiz">${getQuizLength}</td>
      <td id="quizScore">${ele.score}</td>
      <td id="quizScore">${((ele.score / getQuizLength)*100).toFixed(2)}</td>
    </tr> 
  </tbody> 
    `
});