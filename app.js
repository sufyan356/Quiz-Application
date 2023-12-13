// SHOW PASSWORD FUNCTION 
const showPassword = () => {
    let showAndHidePass = document.querySelector(".showAndHidePass");
    let pass = document.getElementById("password");
    if(pass.type === "password"){
        pass.type = "text"
        showAndHidePass.innerHTML = 'HIDE PASSWORD'
    }
    else{
        pass.type = "password"
        showAndHidePass.innerHTML = 'SHOW PASSWORD'
    }
}

// SIGN UP FUNCTION
const signUp = (event) =>{
    event.preventDefault();
    let signUpName = document.getElementById("exampleInputName").value 
    let signUpEmail = document.getElementById("exampleInputEmail").value 
    let signUpPassword = document.getElementById("password").value 
    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.*[a-zA-Z0-9@#$%^&+=!]).{8,}$/;
    if(!signUpName){
        showError("please Fill Name Field!..");
    }

    else if(!emailPattern.test(signUpEmail)){
        showError("Invalid Email!.." , "Please Enter Valid Email");
    }

    else if(!passwordPattern.test(signUpPassword)){
        showError("Invalid Password!.." , "Please Enter Valid Password");
    }

    else{
      

        let usersData = JSON.parse(localStorage.getItem("users")) || [];
        if(isEmailInvalid(signUpEmail , usersData)){
            showError("Email Already Exist!.." , "Please Enter Unique Email")
        }
        else if(isPasswordInvalid(signUpPassword , usersData)){
            showError("Password Already Exist!.." , "Please Enter Unique Password")
        }
        else{
            const userID = usersData.length + 1;
            let userObj = {
                name:signUpName,
                email:signUpEmail,
                password:signUpPassword,
                userID
            }
            usersData.push(userObj);
            localStorage.setItem("users" , JSON.stringify(usersData));

            setTimeout( () =>{
                location.href = 'signIn.html'
            });
            showSuccess("Congratulations!.." ,"Sign Up Successfully");
        }
       
    }
}

// ERROR FUNCTION
const showError = (titleMsg , textMsg) =>{
    swal({
        title: titleMsg,
        text: textMsg,
        icon: "error",
        button: "Aww yiss!",
      });
}

// SUCCESS FUNCTION
const showSuccess = (titleMsg , textMsg) =>{
    swal({
        title: titleMsg,
        text: textMsg,
        icon: "success",
        button: "Aww yiss!",
      });
}

// EMAIL INVALID FUNCTION
const isEmailInvalid = (signUpEmail , usersData) => {
    return usersData.some( data => data.email === signUpEmail) ;
}

// PASSWORD INVALID FUNCTION
const isPasswordInvalid = (signUpPassword , usersData) => {
    return usersData.some( data => data.password === signUpPassword) ;
}

// SIGN IN LINK 
const signInLink = () => {
    location.href = 'signIn.html '
}

// SIGN UP LINK 
const signUpLink = () => {
    location.href = 'index.html '
}

// SIGN IN FUNCTION
const signIn = (event) => {
    event.preventDefault()

    let signInEmail = document.getElementById("exampleInputEmail").value 
    let signInPassword = document.getElementById("password").value
    let emailStatus = false; 
    let usersData = JSON.parse(localStorage.getItem("users")) || [];
    
    usersData.forEach( (data) => {
        if(data.email === signInEmail){
            emailStatus = true;
            if(data.password === signInPassword){
                localStorage.setItem("latestUser" , JSON.stringify(data.name));
                localStorage.setItem("latestUserID" , JSON.stringify(data.userID));

                setInterval(()=>{
                    location.href = 'quiz-selection_quiz-start.html'
                })
                showSuccess("Sign In SuccessFully!..");
            }
            else{
                showError("Invalid Password!..");
                
            }
        }

       if(!emailStatus){
        showError("Invalid Email!..")
       }
    })

} 


// window.onbeforeunload = function (){
//     return "if you reload the page all details will cancelled!.."
// }
// function handlePageRelloadConfirmation(){
//     var confirmation = confirm("if you reload the page, all detailed will be cancel . do you want to proceed?")
//     if(!confirmation){
//         e.preventDefault()
//     }
// }
// window.addEventListener('beforeunload', handlePageRelloadConfirmation)

//  QUIZ APPLICATION LOGIC 
// GLOBAL VARIABLES
let ques = document.getElementById("questions")
let optA = document.getElementById("option_a")
let optB = document.getElementById("option_b")
let optC = document.getElementById("option_c")
let optD = document.getElementById("option_d")
const nextBtn = document.querySelector("#nextBtn");
let Answers = document.getElementsByName("options");
let timerInterval;
var index = 0;
let score = 0;


// Function to check if a user has completed a quiz
const hasUserCompletedQuiz = (latestUserID, quizId) => {
    const quizKey = `quizCompleted_${latestUserID}`;
    const completedQuizzes = JSON.parse(localStorage.getItem(quizKey)) || [];
    return completedQuizzes.includes(quizId);
};

// Function to mark a quiz as completed for a user
const markQuizAsCompleted = (latestUserID, quizId) => {
    const quizKey = `quizCompleted_${latestUserID}`;
    const completedQuizzes = JSON.parse(localStorage.getItem(quizKey)) || [];

    // Check if the quiz is not already completed
    if (!completedQuizzes.includes(quizId)) {
        completedQuizzes.push(quizId);
        localStorage.setItem(quizKey, JSON.stringify(completedQuizzes));
    }
};

// NEXT QUESTION FUNCTION 
const nextQuestion = () => {
    
    // Clear the previous timer interval if it exists
    clearInterval(timerInterval);
    
    let quizIndex = JSON.parse(localStorage.getItem("quizNumber"));
    let AllData = JSON.parse(localStorage.getItem("allQuizData"));
    const options = document.getElementsByName("options");
    let quizLength = AllData[quizIndex].length - 1;
    options.forEach((opt) => {
        if (opt.checked) {
            let selectedValue = opt.value;
            let selectedAns = AllData[quizIndex][index- 1][`option${selectedValue}`];
            
            let correctAns = AllData[quizIndex][index - 1].correct_answer;
            // console.log(selectedAns);
            // console.log(correctAns);
            if (correctAns == selectedAns) {
                score++;
                console.log(`CORRECT ANSWER -> ${correctAns} YOUR CHOICE -> ${selectedAns}`)
            }
            else{
                console.log(`CORRECT ANSWER -> ${correctAns} YOUR CHOICE -> ${selectedAns}`)
            }

            opt.checked = false;
        }
    });
    nextBtn.disabled = true;

    if (index > quizLength) {
        let questionNumber = 0;
        let date = new Date(Date.now());
        let dateFormat = date.toLocaleString();
        let userID = JSON.parse(localStorage.getItem("latestUserID"));
        let quizName = JSON.parse(localStorage.getItem("QuizName")) ;
        let quizResultData = JSON.parse(localStorage.getItem("quizResultData")) || [];
        let serialNumber = quizResultData.length > 0 ? quizResultData[quizResultData.length - 1].serialNumber + 1 : 0;
        let quizResultObj = {
            score,
            dateFormat,
            quizLength,
            quizName,
            serialNumber,
            userID
        }
        quizResultData.push(quizResultObj)
        localStorage.setItem("quizResultData" , JSON.stringify(quizResultData));

        markQuizAsCompleted(userID, quizIndex);
        submitAnswer();
    } else {
        
        ques.innerText = AllData[quizIndex][index].question;
        optA.innerText = AllData[quizIndex][index].option1;
        optB.innerText = AllData[quizIndex][index].option2;
        optC.innerText = AllData[quizIndex][index].option3;
        optD.innerText = AllData[quizIndex][index].option4;
        index++;

        // Start the timer for the new question
        startTimer();
    }
};


// LOAD QUIZ FUNCTION 
const loadQuiz = (quizID , QuizName) => {
    let latestUserID = JSON.parse(localStorage.getItem("latestUserID"));
    localStorage.setItem("QuizName" , JSON.stringify(QuizName));
    localStorage.setItem("quizNumber", JSON.stringify(quizID));

    if (hasUserCompletedQuiz(latestUserID, quizID)) {
        swal("YOU HAVE ALREADY ATTEND QUIZ", "Once You Completed The Quiz You Won't Be Able To Attend Again..", "info");
        return; // Exit the function without starting the quiz
    }

    clearInterval(timerInterval);
    
    let quizSelector = document.querySelector(".container-wrapper-into");
    let quizStart = document.querySelector(".container-wrapper-quiz");
    quizSelector.classList.add("quizSelectorHide");
    quizStart.classList.add("quizStart");
    nextQuestion();
};

// TIMER FUNCTION 
const startTimer = () => {
    let min = 59;
    let timer = document.getElementById("timer");
    timerInterval = setInterval(() => {
        timer.innerText = min;
        min--;
        if (min < 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
};

// LOAD ALL QUIZ FUNCTION 
const loadAllQuiz = () => {
    
    const allQuizData = [
            [
                {
                    question : "What is the purpose of the 'if' statement in Python?",
                    option1:"To define a function",
                    option2:"To declare a variable",
                    option3:"To perform conditional execution of code",
                    option4:"To create a loop",
                    correct_answer: "To perform conditional execution of code"
                },
                {
                    question : "How do you open a file named 'example.txt' in Python for reading?",
                    option1:"file = open('example.txt', 'w')",
                    option2:"open('example.txt', 'r')",
                    option3: "open('example.txt', 'a')",
                    option4: "file = read_file('example.txt')",
                    correct_answer: "open('example.txt', 'r')"
                },
                {
                    question: "my_list = [1, 2, 3, 4, 5]; \nnew_list = [x * 2 for x in my_list if x % 2 == 0]; \nprint(new_list)",
                    option1: "[2, 4, 6, 8, 10]",
                    option2: "[4, 8]",
                    option3: "[1, 2, 3, 4, 5]",
                    option4: "[1, 3, 5]",
                    correct_answer: "[4, 8]"
                }
            ],

            [
        
                {
                    question : "What is the result of the following JavaScript code?\n console.log(2 + '2');",
                    option1:"4",
                    option2:"'22'",
                    option3:"22",
                    option4:"'4'",
                    correct_answer: "'22'"
                },
                {
                    question : "Which keyword is used to declare a variable in JavaScript?",
                    option1:"var",
                    option2:"int",
                    option3:"string",
                    option4:"declare",
                    correct_answer: "var"
                },
                {
                    question: "How can you add a comment in JavaScript?",
                    option1:"//This is a comment",
                    option2:" <!--This is a comment-->",
                    option3:"This is a comment",
                    option4:"/This is a comment/",  
                    correct_answer: "//This is a comment"
                }
               
            ],

            [
            {
                question: "What is the result of the following Java code?\nint x = 5;\nint y = 2;\nSystem.out.println(x / y);",
                option1:"2.5",
                option2:"3",
                option3:"2",
                option4:"2.0",
                correct_answer: "2"
            },
            {
                question: "Which keyword is used to define a class in Java?",
                option1:"class",
                option2:"function",
                option3:"public",
                option4:"new",
                correct_answer: "class"
            },
            {
                question: "How do you declare an array in Java?",
                option1:"int[] myArray;",
                option2:"array myArray[];",
                option3:"myArray = new Array();",
                option4:"Array myArray = [];",
                correct_answer: "int[] myArray;"
            }
            ],
    
            [
                {
                    question: "What is the result of the following C++ code?\nint x = 5;\nint y = 2;\nint z = x / y;\nstd::cout << z;",
                    option1:"2.5",
                    option2:"3",
                    option3:"2",
                    option4:"2.0",
                    correct_answer: "2"
                },
                {
                    question: "In C++, what is the difference between 'cin' and 'cout'?",
                    option1:"Both are used for input.",
                    option2:"Both are used for output.",
                    option3:"'cin' is used for input, and 'cout' is used for output.",
                    option4:"'cin' is used for output, and 'cout' is used for input.",
                    correct_answer: "'cin' is used for input, and 'cout' is used for output."
                },
                {
                    question: "What is the correct syntax to declare a pointer to an integer in C++?",
                    option1: "int *myPtr;",
                    option2: "pointer myPtr = int;",
                    option3: "int myPtr = &;",
                    option4: "int myPtr = *;",
                    correct_answer: "int *myPtr;"
                }
            ],
    
            [
                {
                    question: "What is the output of the following C# code?\nint x = 5;\nint y = 2;\nint z = x / y;\nConsole.WriteLine(z);",
                    option1:"2.5",
                    option2:"3",
                    option3:"2",
                    option4:"2.0",
                    correct_answer: "2"
                },
                {
                    question: "In C#, what keyword is used to declare a variable that cannot be modified after its initial assignment?",
                    option1:"const",
                    option2:"readonly",
                    option3:"var",
                    option4:"static",
                    correct_answer: "const"
                },
                {
                    question: "How do you declare a method in C# that does not return a value?",
                    option1:"void myMethod()",
                    option2:"int myMethod()",
                    option3:"string myMethod()",
                    option4:"bool myMethod()",
                    correct_answer: "void myMethod()"
                }
            ],
    
            [
                {
                    question: "What is TypeScript?",
                    option1:"A JavaScript library for building user interfaces",
                    option2:"A superset of JavaScript that adds static typing",
                    option3:"A web framework for building server-side applications",
                    option4:"A database management system",
                    correct_answer: "A superset of JavaScript that adds static typing"
                },
                {
                    question: "In TypeScript, what keyword is used to declare a variable with a specific data type?",
                    option1:"type",
                    option2:"let",
                    option3:"var",
                    option4:"const",
                    correct_answer: "let"
                },
                {
                    question: "Which tool can be used to transpile TypeScript code into JavaScript?",
                    option1:"TypeScript Compiler (tsc)",
                    option2:"Babel",
                    option3:"Webpack",
                    option4:"Node.js",
                    correct_answer: "TypeScript Compiler (tsc)"
                }
            ],
    
            [
                {
                    question: "What does SQL stand for?",
                    
                     option1:"Structured Query Language",
                     option2:"Simple Query Language",
                     option3:"Standard Query Language",
                     option4:"Structured Question Language",
                    
                    correct_answer: "Structured Query Language"
                },
                {
                    question: "Which SQL statement is used to retrieve data from a database?",
                    
                    option1:"GET",
                    option2:"SELECT",
                    option3:"RETRIEVE",
                    option4:"FETCH",
                    
                    correct_answer: "SELECT"
                },
                {
                    question: "What is the SQL command used to add a new row to a table?",
                    
                     option1:"INSERT INTO",
                     option2:"ADD ROW",
                     option3:"UPDATE",
                     option4:"CREATE TABLE",
                    
                    correct_answer: "INSERT INTO"
                }
            ],
    
            [
                {
                    question: "What type of database is MongoDB?",
                    
                    option1:"Relational Database",
                    option2:"NoSQL Database",
                    option3:"Graph Database",
                    option4:"Key-Value Database",
                    
                    correct_answer: "NoSQL Database"
                },
                {
                    question: "In MongoDB, which data format is used to store documents?",
                  
                    option1:"JSON",
                    option2:"XML",
                    option3:"CSV",
                    option4:"HTML",
                    
                    correct_answer: "JSON"
                },
                {
                    question: "What is the primary key used in MongoDB to uniquely identify documents in a collection?",
                 
                    option1:"_id",
                    option2:"key",
                    option3:"primary_key",
                    option4:"doc_id",
                    
                    correct_answer: "_id"
                }
            ],
    
            [
                {
                    question: "What is Node.js?",
                    
                     option1:"A front-end JavaScript framework",
                     option2:"A runtime environment for executing JavaScript on the server",
                     option3:"A database management system",
                     option4:"A text editor",
                    
                    correct_answer: "A runtime environment for executing JavaScript on the server"
                },
                {
                    question: "Which module is used in Node.js to work with the file system?",
                    
                    option1:"http",
                    option2:"fs",
                    option3:"path",
                    option4:"net",
                    
                    correct_answer: "fs"
                },
                {
                    question: "What is the Node.js package manager that is used to install and manage packages?",
                    
                    option1:"NPM (Node Package Manager)",
                    option2:"Node.js Manager",
                    option3:"Node Packager",
                    option4:"Node Installer",
                    
                    correct_answer: "NPM (Node Package Manager)"
                }
            ]    
    ]

    localStorage.setItem("allQuizData" , JSON.stringify(allQuizData));
    JSON.parse(localStorage.getItem("allQuizData"));

 }

//  ANSWER CHECKED FUNCTION 
 let radiochecked = () => {
    nextBtn.disabled = false;
 }

//  REDIRECTION TO RESULTS 
 const submitAnswer = () => {
    location.href = 'result-quiz.html'
 }
//  REDIRECTION TO SIGN IN FORM 
 const redirectToSignIn = () => {
    location.href = 'signIn.html ';
 }

//  ALL PREVIOUS RESULT DATA 
const resultData = () => {
    location.href ='result-data.html'
}
const lightAndDarkTheme = () => {
    let containerWrapper = document.querySelector(".container-wrapper-into");
    let greetings = document.querySelector(".greetings");
    let darkTheme = document.getElementById("darkTheme")
    darkTheme.classList.toggle("white")
    containerWrapper.classList.toggle("bgBlack");
    greetings.classList.toggle("bgBlack");

}

// INITIALLY CALL  
loadAllQuiz();






 




