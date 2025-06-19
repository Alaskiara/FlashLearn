const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const category = document.getElementById("kategorie");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const toggleViewBtn = document.getElementById("toggle-view-btn");
const editBtn = document.getElementById("edit");
let editBool = false;
let showAll = true;  // Start with showing all cards
let cardID = null;

// Global variable to track the current card index
let currentCardIndex = 0;

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
    // if (editBool) {
    //     editBool = false;
    //     submitQuestion();
    // }
    editBool = false;
    cardID = null;
})
);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".edit").forEach(editButton => {
      editButton.addEventListener("click", () => {
          const cardElement = editButton.closest(".card");
          const frage = cardElement.querySelector(".question-div").innerText.trim();
          const antwort = cardElement.querySelector(".answer-div").innerText.trim();
          const kategorieID = cardElement.dataset.kategorieId;
          cardID = cardElement.dataset.id;

          question.value = frage;
          answer.value = antwort;
          category.value = kategorieID;

          addQuestionCard.classList.remove("hide");
          container.classList.add("hide");
          editBool = true;
      });
  });

  document.querySelectorAll(".delete").forEach(deleteButton => {
      deleteButton.addEventListener("click", () => {
          const cardElement = deleteButton.closest(".card");
          const cardId = cardElement.dataset.id;

          const modal = document.getElementById("delete-confirmation-modal");
          const confirmBtn = document.getElementById("confirm-delete-btn");
          const cancelBtn = document.getElementById("cancel-delete-btn");

          modal.classList.remove("hide");

          confirmBtn.onclick = () => {
              fetch("templates/delete_card.php", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: `card_id=${encodeURIComponent(cardId)}`,
              })
              .then((res) => res.text())
              .then((text) => {
                  if (text.trim() === "success") {
                      cardElement.remove();
                      updateCardNavigation();
                  } else {
                      console.error('Fehler beim Löschen:', text);
                  }
                  modal.classList.add("hide");
              })
              .catch((error) => {
                  console.error('Fetch-Fehler:', error);
                  modal.classList.add("hide");
              });
          };

          cancelBtn.onclick = () => {
              modal.classList.add("hide");
          };
      });
  });

  const cardListContainer = document.querySelector(".card-list-container");
  cardListContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("show-hide-btn")) {
          e.preventDefault();

          const card = e.target.closest(".card");
          if (!card) return;

          const answer = card.querySelector(".answer-div");
          if (!answer) return;

          answer.classList.toggle("hide");
          e.target.textContent = answer.classList.contains("hide") ? "Show" : "Hide";
      }
  });

    if (isLoggedIn) {
        // Show all cards initially
        showAllCards();
        
        // Initialize toggle button text
        const toggleViewBtn = document.getElementById("toggle-view-btn");
        if (toggleViewBtn) {
            toggleViewBtn.textContent = "Show Last";
        }
    }

    // Category Modal Functionality
    const addCategoryBtn = document.getElementById("add-category");
    const categoryModal = document.getElementById("category-modal");
    const saveCategoryBtn = document.getElementById("save-category");
    const cancelCategoryBtn = document.getElementById("cancel-category");
    const categoryInput = document.getElementById("category-name");

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener("click", () => {
            console.log("Add Category clicked");
            categoryModal.classList.remove("hide");
            categoryInput.value = "";
        });
    }

    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener("click", () => {
            categoryModal.classList.add("hide");
        });
    }

    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener("click", () => {
            const categoryName = categoryInput.value.trim();
            if (!categoryName) {
                alert("Please enter a category name");
                return;
            }

            fetch("templates/save_category.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `name=${encodeURIComponent(categoryName)}`,
            })
            .then(response => response.text())
            .then(text => {
                if (text.startsWith("success:")) {
                    location.reload();
                } else {
                    alert("Error creating category: " + text);
                }
            });
        });
    }

    // Category folder handling
    document.querySelectorAll(".category-folder").forEach(folder => {
        folder.addEventListener("click", () => {
            const categoryId = folder.dataset.id;
            
            // Toggle active state of folders
            document.querySelectorAll(".category-folder").forEach(f => {
                f.classList.remove("active");
            });
            folder.classList.add("active");
            
            // Show card container
            const cardCon = document.getElementById("card-con");
            cardCon.style.display = "block";
            
            // Filter cards
            const cards = document.querySelectorAll(".card");
            let hasVisibleCards = false;
            
            cards.forEach(card => {
                if (card.dataset.kategorieId === categoryId) {
                    card.style.display = "block";
                    hasVisibleCards = true;
                } else {
                    card.style.display = "none";
                }
            });

            // Show message if no cards in category
            const noCardsMessage = document.querySelector(".no-cards-message");
            if (!hasVisibleCards) {
                if (!noCardsMessage) {
                    const message = document.createElement("p");
                    message.className = "no-cards-message";
                    message.textContent = "No flashcards in this category yet.";
                    cardCon.appendChild(message);
                }
            } else if (noCardsMessage) {
                noCardsMessage.remove();
            }
        });
    });

    // Show all cards when adding a new card
    document.getElementById("add-flashcard").addEventListener("click", () => {
        const cardCon = document.getElementById("card-con");
        cardCon.style.display = "block";
        
        document.querySelectorAll(".category-folder").forEach(f => {
            f.classList.remove("active");
        });
        
        document.querySelectorAll(".card").forEach(card => {
            card.style.display = "block";
        });
    });

    // Category deletion handling
    document.querySelectorAll(".delete-category").forEach(deleteBtn => {
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const categoryFolder = deleteBtn.closest(".category-folder");
            const categoryId = categoryFolder.dataset.id;
            const cardCount = parseInt(categoryFolder.querySelector(".card-count").textContent.match(/\d+/)[0]);
            
            const modal = document.getElementById("delete-category-modal");
            const warning = document.getElementById("delete-category-warning");
            
            if (cardCount > 0) {
                warning.textContent = "Deleting this category will also delete all of its flashcards, are you sure you want to continue?";
            } else {
                warning.textContent = "Are you sure you want to delete this category?";
            }
            
            modal.classList.remove("hide");
            
            const confirmBtn = document.getElementById("confirm-category-delete");
            const cancelBtn = document.getElementById("cancel-category-delete");
            
            const deleteHandler = () => {
                fetch("templates/delete_category.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `category_id=${categoryId}`,
                })
                .then(response => response.text())
                .then(text => {
                    if (text === "success") {
                        location.reload();
                    } else {
                        alert("Error deleting category: " + text);
                    }
                });
                
                // Remove event listeners
                confirmBtn.removeEventListener("click", deleteHandler);
                cancelBtn.removeEventListener("click", cancelHandler);
            };
            
            const cancelHandler = () => {
                modal.classList.add("hide");
                // Remove event listeners
                confirmBtn.removeEventListener("click", deleteHandler);
                cancelBtn.removeEventListener("click", cancelHandler);
            };
            
            // Add event listeners
            confirmBtn.addEventListener("click", deleteHandler);
            cancelBtn.addEventListener("click", cancelHandler);
        });
    });
});



// Save Flashcard
// cardButton.addEventListener("click", (submitQuestion = () => {
//         editBool = false;
//         tempQuestion = question.value.trim();
//         tempAnswer = answer.value.trim();
//         if (!tempQuestion || !tempAnswer) {
//             errorMessage.classList.remove("hide");
//         } else {
//             container.classList.remove("hide");
//             errorMessage.classList.add("hide");
//             viewList();
//             question.value = "";
//             answer.value = "";
//         }
//     const frage = document.getElementById("question").value.trim();
//     const antwort = document.getElementById("answer").value.trim();
//     const kategorie = document.getElementById("kategorie").value;

//     const errorEl = document.getElementById("error");

//     if (!frage || !antwort || !kategorie) {
//         errorEl.classList.remove("hide");
//         errorEl.textContent = "Input fields cannot be empty!";
//         return;
//     }

//     fetch('../../templates/save_card.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: `frage=${encodeURIComponent(frage)}&antwort=${encodeURIComponent(antwort)}&kategorie=${encodeURIComponent(kategorie)}`
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === "success") {
//             alert("Flashcard saved!");
//             location.reload(); // Seite neu laden, damit neue Karte angezeigt wird
//         } else {
//             errorEl.classList.remove("hide");
//             errorEl.textContent = "Error saving card: " + data.message;
//         }
//     })
//     .catch(error => {
//         errorEl.classList.remove("hide");
//         errorEl.textContent = "Unexpected error: " + error;
//     });
//     })
// );

function submitQuestion() {
    const frage = document.getElementById("question").value.trim();
    const antwort = document.getElementById("answer").value.trim();
    const kategorie = document.getElementById("kategorie").value;
    const errorEl = document.getElementById("error");

    if (!frage || !antwort || !kategorie) {
        errorEl.classList.remove("hide");
        errorEl.textContent = "Input fields cannot be empty!";
        return;
    }

    if (isLoggedIn) {
    const endpoint = editBool ? 'templates/update_card.php' : 'templates/save_card.php';
    const payload = editBool 
        ? `card_id=${encodeURIComponent(cardID)}&frage=${encodeURIComponent(frage)}&antwort=${encodeURIComponent(antwort)}&kategorie=${encodeURIComponent(kategorie)}`
        : `frage=${encodeURIComponent(frage)}&antwort=${encodeURIComponent(antwort)}&kategorie=${encodeURIComponent(kategorie)}`;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    })
      .then((response) => response.text())
      .then((text) => {
        if (text.trim() === "success") {
          location.reload();
        } else {
          errorEl.classList.remove("hide");
          errorEl.textContent = "Error: " + text;
        }
      })
      .catch((error) => {
        errorEl.classList.remove("hide");
        errorEl.textContent = "Unexpected error: " + error;
      });

    editBool = false;
    cardID = null;
    } else {
        viewList();
        container.classList.remove("hide");
        addQuestionCard.classList.add("hide");
    }
}

cardButton.addEventListener("click", submitQuestion);


// Function to show only the last flashcard
function showLastCard() {
    const cardListContainer = document.querySelector(".card-list-container");
    const cards = Array.from(cardListContainer.querySelectorAll(".card"));
    
    if (cards.length === 0) return;

    // Hide all cards first
    cards.forEach(card => {
        card.style.display = "none";
    });

    // Show current card
    cards[currentCardIndex].style.display = "block";

    // Update navigation buttons
    cards.forEach((card, index) => {
        const prevBtn = card.querySelector(".card-prev-btn");
        const nextBtn = card.querySelector(".card-next-btn");

        if (index === currentCardIndex) {
            // Only show navigation buttons if there are multiple cards
            if (prevBtn) {
                prevBtn.style.display = cards.length > 1 && currentCardIndex > 0 ? "flex" : "none";
                prevBtn.onclick = () => {
                    if (currentCardIndex > 0) {
                        currentCardIndex--;
                        showLastCard();
                    }
                };
            }
            if (nextBtn) {
                nextBtn.style.display = cards.length > 1 && currentCardIndex < cards.length - 1 ? "flex" : "none";
                nextBtn.onclick = () => {
                    if (currentCardIndex < cards.length - 1) {
                        currentCardIndex++;
                        showLastCard();
                    }
                };
            }
        }
    });

    cardListContainer.classList.add("single-card");
}

// Function to show all flashcards
function showAllCards() {
    const cardListContainer = document.querySelector(".card-list-container");
    const cards = cardListContainer.querySelectorAll(".card");
    
    cards.forEach(card => {
        card.style.display = "block";
        // Always hide navigation buttons when showing all cards
        const prevBtn = card.querySelector(".card-prev-btn");
        const nextBtn = card.querySelector(".card-next-btn");
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
    });

    cardListContainer.classList.remove("single-card");
}

// Toggle between "Show All" and "Show Last"
toggleViewBtn.addEventListener("click", () => {
    const cardListContainer = document.querySelector(".card-list-container");
    const cards = cardListContainer.querySelectorAll(".card");

    if (cards.length === 0) return;

    if (showAll) {
        // Switch to single card view
        showLastCard();
        toggleViewBtn.textContent = "Show All";
    } else {
        // Switch to all cards view
        showAllCards();
        toggleViewBtn.textContent = "Show Last";
    }
    showAll = !showAll;
});


// Shows/Hides Previous/Next buttons on each flashcard, depending on the 'show' parameter and the currentCardIndex.
function showCardNavigationButtons(show) {
    const cardListContainer = document.querySelector(".card-list-container");
    const cards = cardListContainer.querySelectorAll(".card");
    cards.forEach(card => {
        const prevBtn = card.querySelector(".card-prev-btn");
        const nextBtn = card.querySelector(".card-next-btn");
        if (prevBtn) prevBtn.style.display = show && currentCardIndex > 0 ? "inline-block" : "none";
        if (nextBtn) nextBtn.style.display = show && currentCardIndex < cards.length - 1 ? "inline-block" : "none";
    });
}

// Show the button when the first flashcard is added
function showToggleButton() {
    if (toggleViewBtn.classList.contains("hide")) {
        toggleViewBtn.classList.remove("hide");
    }
}

// Updates the flashcard navigation: shows only current card and displays the Previous/Next buttons on the current card if navigation is possible (not at the first or last card).
function updateCardNavigation() {
    const cardListContainer = document.querySelector(".card-list-container");
    const cards = cardListContainer.querySelectorAll(".card");
    cards.forEach((card, idx) => {
        card.style.display = idx === currentCardIndex ? "block" : "none";
        // Show/hide navigation buttons on the current card
        const prevBtn = card.querySelector(".card-prev-btn");
        const nextBtn = card.querySelector(".card-next-btn");
        if (prevBtn) prevBtn.style.display = (idx === currentCardIndex && currentCardIndex > 0) ? "inline-block" : "none";
        if (nextBtn) nextBtn.style.display = (idx === currentCardIndex && currentCardIndex < cards.length - 1) ? "inline-block" : "none";
    });
    if (cards.length > 0) {
        cardListContainer.classList.add("single-card");
    }
}

function viewList() {
    var listCard = document.getElementsByClassName("card-list-container");
    var div = document.createElement("div");
    div.classList.add("card");
    div.setAttribute("data-kategorie", category.value);
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
        link.innerHTML = displayAnswer.classList.contains("hide") ? "Show" : "Hide";
    });

    div.appendChild(link);
    div.appendChild(displayAnswer);

    // Buttons-Container
    let buttonsCon = document.createElement("div");
    buttonsCon.classList.add("buttons-con");

    // Navigation Buttons (Previous/Next)
    let cardPrevBtn = document.createElement("button");
    cardPrevBtn.setAttribute("class", "card-prev-btn nav-btn");
    cardPrevBtn.innerHTML = `<i class="fa-solid fa-angle-left"></i>`;
    cardPrevBtn.title = "Previous";
    cardPrevBtn.style.display = "none";
    cardPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateCardNavigation();
        }
    });

    let cardNextBtn = document.createElement("button");
    cardNextBtn.setAttribute("class", "card-next-btn nav-btn");
    cardNextBtn.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;
    cardNextBtn.title = "Next";
    cardNextBtn.style.display = "none";
    cardNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cardListContainer = document.querySelector(".card-list-container");
        const cards = cardListContainer.querySelectorAll(".card");
        if (currentCardIndex < cards.length - 1) {
            currentCardIndex++;
            updateCardNavigation();
        }
    });

    // Edit button
    var editButton = document.createElement("button");
    editButton.setAttribute("class", "edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", () => {
        editBool = true;
        modifyElement(editButton, true);
        addQuestionCard.classList.remove("hide");
    });

    // Delete Button
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      const cardListContainer = document.querySelector(".card-list-container");
      const cards = cardListContainer.querySelectorAll(".card");
      modifyElement(deleteButton);
      const newCards = cardListContainer.querySelectorAll(".card");
      if (currentCardIndex > newCards.length - 1) {
        currentCardIndex = Math.max(0, newCards.length - 1);
      }
      updateCardNavigation();
    });

    // Buttons in order: Prev, Next, Edit, Delete
    buttonsCon.appendChild(cardPrevBtn);
    buttonsCon.appendChild(cardNextBtn);
    buttonsCon.appendChild(editButton);
    buttonsCon.appendChild(deleteButton);

    disableButtons(false);

    div.appendChild(buttonsCon);
    listCard[0].appendChild(div);

    showToggleButton();

    hideQuestion();

    // Always show the last added card
    const cardListContainer = document.querySelector(".card-list-container");
    currentCardIndex = cardListContainer.querySelectorAll(".card").length - 1;
    updateCardNavigation();
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