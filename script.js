const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;

// Add question
addQuestion.addEventListener("click", () => {
    container.classList.add("hide");
    question.value = "";
    answer.value = "";
    addQuestionCard.classList.remove("hide");
});

// Hide "Add Flashcard" (Close Button)
closeBtn.addEventListener("click", (hideQuestion = () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    if(editBool){
        editBool = false;
        submitQuestion();
    }
})
);

// Save Flashcard
cardButton.addEventListener("click", (submitQuestion = () => {
        editBool = false;
        tempQuestion = question.value.trim();
        tempAnswer = answer.value.trim();
        if (!tempQuestion || !tempAnswer) {
            errorMessage.classList.remove("hide");
        } else {
            container.classList.remove("hide");
            error.errorMessage.classList.add("hide");
            viewList();
            question.value = "";
            answer.value = "";
        }
    })
);