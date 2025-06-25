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

// Globale Variable für die aktuelle Kategorie
let currentCategoryId = null;

// Global variable to track the current card index
let currentCardIndex = 0;

// Add question
addQuestion.addEventListener("click", () => {
    container.classList.add("hide");
    question.value = "";
    answer.value = "";
    addQuestionCard.classList.remove("hide");
});

// Hide "Add Flashcard" (Close Button) - Korrigiert
closeBtn.addEventListener("click", (hideQuestion = () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    editBool = false;
    cardID = null;
    
    // Wiederherstellen der Kategorieansicht wenn eine Kategorie aktiv war
    if (currentCategoryId !== null) {
        // Filterung der Karten nach aktueller Kategorie
        filterCardsByCategory(currentCategoryId);
    } else {
        // Wenn keine Kategorie aktiv war, alle Karten anzeigen
        document.querySelectorAll(".card").forEach(card => {
            card.style.display = "block";
        });
    }
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

  // Delete Button Handler - Korrigiert mit Kategorie-Counter Update
  document.querySelectorAll(".delete").forEach(deleteButton => {
      deleteButton.addEventListener("click", () => {
          const cardElement = deleteButton.closest(".card");
          const cardId = cardElement.dataset.id;
          const categoryId = cardElement.dataset.kategorieId;

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
                      
                      // Kategorie-Counter aktualisieren
                      updateCategoryCounter(categoryId, -1);
                      
                      // Nach dem Löschen die aktuelle Kategorieansicht beibehalten
                      if (currentCategoryId !== null) {
                        filterCardsByCategory(currentCategoryId);
                      }
                      
                      // Navigation-Buttons korrekt aktualisieren
                      updateNavigationAfterDelete();
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

    // Category folder handling - Erweitert um currentCategoryId Tracking
    document.querySelectorAll(".category-folder").forEach(folder => {
        folder.addEventListener("click", () => {
            const categoryId = folder.dataset.id;
            currentCategoryId = categoryId; // Aktuelle Kategorie speichern
            
            // Toggle active state of folders
            document.querySelectorAll(".category-folder").forEach(f => {
                f.classList.remove("active");
            });
            folder.classList.add("active");
            
            // Show card container
            const cardCon = document.getElementById("card-con");
            cardCon.style.display = "block";
            
            filterCardsByCategory(categoryId);
        });
    });

    // Show all cards when adding a new card - Erweitert
    document.getElementById("add-flashcard").addEventListener("click", () => {
        const cardCon = document.getElementById("card-con");
        cardCon.style.display = "block";
        
        // Kategorieauswahl NICHT zurücksetzen - currentCategoryId beibehalten
        // currentCategoryId = null; // Diese Zeile entfernen!
        
        // Kategorieordner aktiv lassen falls einer ausgewählt war
        if (currentCategoryId !== null) {
            // Sicherstellen, dass der aktive Ordner markiert bleibt
            const activeFolder = document.querySelector(`.category-folder[data-id="${currentCategoryId}"]`);
            if (activeFolder && !activeFolder.classList.contains("active")) {
                document.querySelectorAll(".category-folder").forEach(f => {
                    f.classList.remove("active");
                });
                activeFolder.classList.add("active");
            }
            
            // Nur Karten der aktuellen Kategorie anzeigen
            filterCardsByCategory(currentCategoryId);
        } else {
            // Alle Ordner deaktivieren nur wenn keine Kategorie aktiv war
            document.querySelectorAll(".category-folder").forEach(f => {
                f.classList.remove("active");
            });
            
            // Alle Karten anzeigen
            document.querySelectorAll(".card").forEach(card => {
                card.style.display = "block";
            });
        }
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

// Save Button Event-Listener hinzufügen
document.getElementById("save-btn").addEventListener("click", submitQuestion);

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

    // Error-Message verstecken wenn alles korrekt ist
    errorEl.classList.add("hide");

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
                // Kategorie-Counter aktualisieren nur beim Hinzufügen neuer Karten
                if (!editBool) {
                    updateCategoryCounter(kategorie, 1);
                }
                
                // Dialog schließen
                container.classList.remove("hide");
                addQuestionCard.classList.add("hide");
                
                // Nach dem Speichern die aktuelle Kategorieansicht wiederherstellen
                if (currentCategoryId !== null) {
                    // Kurz warten und dann die Seite neu laden um die neue Karte anzuzeigen
                    setTimeout(() => {
                        location.reload();
                    }, 100);
                } else {
                    location.reload();
                }
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
        // Fallback für nicht-eingeloggte Benutzer (falls vorhanden)
        viewList();
        container.classList.remove("hide");
        addQuestionCard.classList.add("hide");
    }
}

// Neue Funktion zum Aktualisieren des Kategorie-Counters
function updateCategoryCounter(categoryId, change) {
    const categoryFolder = document.querySelector(`.category-folder[data-id="${categoryId}"]`);
    if (categoryFolder) {
        const cardCountElement = categoryFolder.querySelector('.card-count');
        if (cardCountElement) {
            const currentCount = parseInt(cardCountElement.textContent.match(/\d+/)[0]);
            const newCount = Math.max(0, currentCount + change);
            cardCountElement.textContent = `(${newCount})`;
        }
    }
}

// Category folder handling - Erweitert
document.querySelectorAll(".category-folder").forEach(folder => {
    folder.addEventListener("click", () => {
        const categoryId = folder.dataset.id;
        currentCategoryId = categoryId; // Aktuelle Kategorie speichern
        
        // Toggle active state of folders
        document.querySelectorAll(".category-folder").forEach(f => {
            f.classList.remove("active");
        });
        folder.classList.add("active");
        
        // Show card container
        const cardCon = document.getElementById("card-con");
        cardCon.style.display = "block";
        
        filterCardsByCategory(categoryId);
    });
});

// Show all cards when adding a new card - Erweitert
document.getElementById("add-flashcard").addEventListener("click", () => {
    const cardCon = document.getElementById("card-con");
    cardCon.style.display = "block";
    
    // Kategorieauswahl NICHT zurücksetzen - currentCategoryId beibehalten
    // currentCategoryId = null; // Diese Zeile entfernen!
    
    // Kategorieordner aktiv lassen falls einer ausgewählt war
    if (currentCategoryId !== null) {
        // Sicherstellen, dass der aktive Ordner markiert bleibt
        const activeFolder = document.querySelector(`.category-folder[data-id="${currentCategoryId}"]`);
        if (activeFolder && !activeFolder.classList.contains("active")) {
            document.querySelectorAll(".category-folder").forEach(f => {
                f.classList.remove("active");
            });
            activeFolder.classList.add("active");
        }
        
        // Nur Karten der aktuellen Kategorie anzeigen
        filterCardsByCategory(currentCategoryId);
    } else {
        // Alle Ordner deaktivieren nur wenn keine Kategorie aktiv war
        document.querySelectorAll(".category-folder").forEach(f => {
            f.classList.remove("active");
        });
        
        // Alle Karten anzeigen
        document.querySelectorAll(".card").forEach(card => {
            card.style.display = "block";
        });
    }
});

// Korrigierte filterCardsByCategory Funktion
function filterCardsByCategory(categoryId) {
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

    // Navigation-Buttons in der Kategorieansicht verstecken
    cards.forEach(card => {
        const prevBtn = card.querySelector(".card-prev-btn");
        const nextBtn = card.querySelector(".card-next-btn");
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
    });

    // Show message if no cards in category
    const cardCon = document.getElementById("card-con");
    let noCardsMessage = document.querySelector(".no-cards-message");
    
    if (!hasVisibleCards) {
        if (!noCardsMessage) {
            const message = document.createElement("p");
            message.className = "no-cards-message";
            message.textContent = "No flashcards in this category yet.";
            message.style.textAlign = "center";
            message.style.color = "#666";
            message.style.fontSize = "1.2em";
            message.style.margin = "2em 0";
            cardCon.appendChild(message);
        }
    } else if (noCardsMessage) {
        noCardsMessage.remove();
    }

    // Sicherstellen, dass wir in der "Show All" Ansicht sind
    const cardListContainer = document.querySelector(".card-list-container");
    cardListContainer.classList.remove("single-card");
    showAll = true;
    const toggleBtn = document.getElementById("toggle-view-btn");
    if (toggleBtn) {
        toggleBtn.textContent = "Show Last";
    }
    
    // Sicherstellen, dass der richtige Ordner als aktiv markiert ist
    document.querySelectorAll(".category-folder").forEach(f => {
        f.classList.remove("active");
    });
    const activeFolder = document.querySelector(`.category-folder[data-id="${categoryId}"]`);
    if (activeFolder) {
        activeFolder.classList.add("active");
    }
}

// Funktion zur Aktualisierung der Navigation nach dem Löschen erweitern
function updateNavigationAfterDelete() {
    const cardListContainer = document.querySelector(".card-list-container");
    const visibleCards = Array.from(cardListContainer.querySelectorAll(".card")).filter(card => 
        card.style.display !== "none"
    );
    
    // Aktuelle Kartenindex anpassen falls nötig
    if (currentCardIndex >= visibleCards.length) {
        currentCardIndex = Math.max(0, visibleCards.length - 1);
    }
    
    // Navigation-Buttons für alle sichtbaren Karten aktualisieren
    visibleCards.forEach((card, index) => {
        const prevBtn = card.querySelector(".card-prev-btn");
        const nextBtn = card.querySelector(".card-next-btn");
        
        // Buttons nur in der Single-Card-Ansicht anzeigen
        if (!showAll && visibleCards.length > 1) {
            if (prevBtn) {
                prevBtn.style.display = (index === currentCardIndex && currentCardIndex > 0) ? "flex" : "none";
            }
            if (nextBtn) {
                nextBtn.style.display = (index === currentCardIndex && currentCardIndex < visibleCards.length - 1) ? "flex" : "none";
            }
        } else {
            // In der All-Cards-Ansicht alle Navigation-Buttons verstecken
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
        }
    });
}