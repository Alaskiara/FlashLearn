const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const category = document.getElementById("kategorie");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;
let cardID = null;
let currentCategoryId = null;
let cardsWereVisibleBeforeModal = false;
let categoryFolderStateBeforeModal = null;

// Add question
addQuestion.addEventListener("click", () => {
    // Speichern, ob Cards vor dem Modal sichtbar waren
    const cardCon = document.getElementById("card-con");
    const computedStyle = window.getComputedStyle(cardCon);
    cardsWereVisibleBeforeModal = computedStyle.display !== "none";
    
    // Aktuellen Zustand der Kategorieordner speichern
    const activeFolder = document.querySelector(".category-folder.active");
    categoryFolderStateBeforeModal = activeFolder ? activeFolder.dataset.id : null;
    
    container.classList.add("hide");
    question.value = "";
    answer.value = "";
    addQuestionCard.classList.remove("hide");
    
    // Kategorie automatisch setzen falls eine aktive Kategorie vorhanden ist
    if (currentCategoryId !== null) {
        const categorySelect = document.getElementById("kategorie");
        if (categorySelect) {
            categorySelect.value = currentCategoryId;
        }
    }
});

// Hide "Add Flashcard" (Close Button)
closeBtn.addEventListener("click", (hideQuestion = () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    editBool = false;
    cardID = null;
    
    // Wiederherstellen der ursprünglichen Ansicht
    const cardCon = document.getElementById("card-con");
    
    // Kategorieordner-Zustand wiederherstellen
    document.querySelectorAll(".category-folder").forEach(f => {
        f.classList.remove("active");
    });
    
    if (categoryFolderStateBeforeModal) {
        // Eine Kategorie war aktiv
        const folderToActivate = document.querySelector(`.category-folder[data-id="${categoryFolderStateBeforeModal}"]`);
        if (folderToActivate) {
            folderToActivate.classList.add("active");
        }
        currentCategoryId = categoryFolderStateBeforeModal;
        cardCon.style.display = "block";
        filterCardsByCategory(categoryFolderStateBeforeModal);
    } else if (!cardsWereVisibleBeforeModal) {
        // Keine Kategorie war aktiv und Cards waren nicht sichtbar
        cardCon.style.display = "none";
        currentCategoryId = null;
    } else {
        // Keine Kategorie war aktiv aber Cards waren sichtbar (alle Cards anzeigen)
        cardCon.style.display = "block";
        currentCategoryId = null;
        document.querySelectorAll(".card").forEach(card => {
            card.style.display = "block";
        });
    }
})
);

document.addEventListener("DOMContentLoaded", () => {
    // Standardmäßig Card-Container verstecken beim ersten Laden
    const cardCon = document.getElementById("card-con");
    cardCon.style.display = "none";
    
    // Kategorie nach dem Laden der Seite wiederherstellen
    const savedCategoryId = localStorage.getItem('selectedCategoryId');
    const showCards = localStorage.getItem('showCards');
    
    if (savedCategoryId) {
        // Gespeicherte Kategorie-ID aus localStorage entfernen
        localStorage.removeItem('selectedCategoryId');
        
        if (savedCategoryId === 'hide-cards') {
            // Card-Container verstecken
            cardCon.style.display = "none";
            currentCategoryId = null;
        } else {
            // Kategorie-Ordner finden und aktivieren
            const categoryFolder = document.querySelector(`.category-folder[data-id="${savedCategoryId}"]`);
            if (categoryFolder) {
                // Kategorie-Ordner als aktiv markieren
                document.querySelectorAll(".category-folder").forEach(f => {
                    f.classList.remove("active");
                });
                categoryFolder.classList.add("active");
                
                // Aktuelle Kategorie setzen
                currentCategoryId = savedCategoryId;
                
                // Card-Container anzeigen
                cardCon.style.display = "block";
                
                // Karten nach Kategorie filtern
                filterCardsByCategory(savedCategoryId);
            } else {
                // Falls die Kategorie nicht mehr existiert, Card-Container verstecken
                cardCon.style.display = "none";
                currentCategoryId = null;
            }
        }
    }
    
    // Zusätzliche Behandlung für showCards Flag
    if (showCards === 'true') {
        localStorage.removeItem('showCards');
        cardCon.style.display = "block";
    }

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

  // Delete Button Handler
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
        // Card-Container initial verstecken nur wenn keine Flags gesetzt sind
        if (!savedCategoryId && !showCards) {
            const cardCon = document.getElementById("card-con");
            cardCon.style.display = "none";
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
                    const parts = text.split(":");
                    const newCategoryId = parts[1];
                    
                    // Modal schließen
                    categoryModal.classList.add("hide");
                    
                    // Neue Kategorie für automatische Auswahl speichern
                    localStorage.setItem('selectedCategoryId', newCategoryId);
                    
                    // Seite neu laden
                    location.reload();
                } else {
                    alert("Error creating category: " + text.replace("error:", ""));
                }
            })
            .catch(error => {
                alert("Error: " + error);
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
                // Prüfen ob die zu löschende Kategorie aktiv ist
                const wasDeletedCategoryActive = (currentCategoryId === categoryId);
                
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
                        // Falls die gelöschte Kategorie aktiv war, Card-Container verstecken
                        if (wasDeletedCategoryActive) {
                            localStorage.setItem('selectedCategoryId', 'hide-cards');
                        } else if (currentCategoryId !== null) {
                            // Andere aktive Kategorie beibehalten
                            localStorage.setItem('selectedCategoryId', currentCategoryId);
                        }
                        
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
                
                // Aktuelle Kategorie für Wiederherstellung speichern
                currentCategoryId = kategorie;
                localStorage.setItem('selectedCategoryId', kategorie);
                
                // Zusätzlich Flag setzen, dass Cards angezeigt werden sollen
                localStorage.setItem('showCards', 'true');
                
                // Seite neu laden
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
        // Fallback für nicht-eingeloggte Benutzer (falls vorhanden)
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
    
    // Sicherstellen, dass der richtige Ordner als aktiv markiert ist
    document.querySelectorAll(".category-folder").forEach(f => {
        f.classList.remove("active");
    });
    const activeFolder = document.querySelector(`.category-folder[data-id="${categoryId}"]`);
    if (activeFolder) {
        activeFolder.classList.add("active");
    }
}