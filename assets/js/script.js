const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const toggleViewBtn = document.getElementById("toggle-view-btn");
let editBool = false;
let showAll = false;

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
    if (editBool) {
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
            errorMessage.classList.add("hide");
            viewList();
            question.value = "";
            answer.value = "";
        }
    })
);

// Function to show only the last flashcard
function showLastCard() {
    const cardListContainer = document.querySelector(".card-list-container");
    const cards = cardListContainer.querySelectorAll(".card");

    cards.forEach((card, index) => {
        card.style.display = index === cards.length - 1 ? "block" : "none";
    });

    // Add the class 'single-card' if only one card is visible
    if (cards.length === 1 || cards[cards.length - 1].style.display === "block") {
        cardListContainer.classList.add("single-card");
    } else {
        cardListContainer.classList.remove("single-card");
    }
}

// Function to show all flashcards
function showAllCards() {
    const cardListContainer = document.querySelector(".card-list-container");
    const cards = cardListContainer.querySelectorAll(".card");

    cards.forEach((card) => {
        card.style.display = "block";
    });
}

// Toggle between "Show All" and "Show Last"
toggleViewBtn.addEventListener("click", () => {
    if (showAll) {
        showLastCard();
        toggleViewBtn.textContent = "Show All";
    } else {
        showAllCards();
        toggleViewBtn.textContent = "Show Last";
    }
    showAll = !showAll;
});

// Show the button when the first flashcard is added
function showToggleButton() {
    if (toggleViewBtn.classList.contains("hide")) {
        toggleViewBtn.classList.remove("hide");
    }
}

// Create Flashcard
function viewList() {
    var listCard = document.getElementsByClassName("card-list-container");
    var div = document.createElement("div");
    div.classList.add("card");
    // Question
    div.innerHTML += `<p class="question-div">${question.value}</p>`;
    // Answer
    var displayAnswer = document.createElement("p");
    displayAnswer.classList.add("answer-div", "hide");
    displayAnswer.innerText = answer.value;

    // Show/Hide answer
    var link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "show-hide-btn");
    link.innerHTML = "Show"; // "Show" by default
    link.addEventListener("click", () => {
        displayAnswer.classList.toggle("hide");
        // Change the button text based on the visibility of the answer
        link.innerHTML = displayAnswer.classList.contains("hide") ? "Show" : "Hide";
    });

    div.appendChild(link);
    div.appendChild(displayAnswer);

    // Edit button
    let buttonsCon = document.createElement("div");
    buttonsCon.classList.add("buttons-con");
    var editButton = document.createElement("button");
    editButton.setAttribute("class", "edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", () => {
        editBool = true;
        modifyElement(editButton, true);
        addQuestionCard.classList.remove("hide");
    });
    buttonsCon.appendChild(editButton);
    disableButtons(false);

    // Delete Button
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
    });
    buttonsCon.appendChild(deleteButton);

    div.appendChild(buttonsCon);
    listCard[0].appendChild(div);

    showToggleButton();

    hideQuestion();
    showLastCard();
}

// Modify Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement.parentElement;
  let parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    let parentAns = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAns;
    question.value = parentQuestion;
    disableButtons(true);
  }
  parentDiv.remove();
};

// Disable edit and delete buttons
const disableButtons = (value) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};