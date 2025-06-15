<?php
session_start();

require_once("config/dbaccess.php");

$flashcards = [];

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $sql = "SELECT * FROM card WHERE User_ID = ? ORDER BY Card_ID DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $flashcards[] = $row;
    }

    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlashLearn</title>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" />
    <link rel="stylesheet" href="assets/css/stylesheet.css">
</head>

<body>
    <header>
        <h1><a href=".index.php" class="logo-link">FlashLearn</a></h1>
        <?php if (isset($_SESSION['username'])): ?>
            <div class="login-info">
                <a class="login-button">
                    <h4>Du bist eingeloggt als: <strong><?= htmlspecialchars($_SESSION['username']) ?></strong></h4>
                </a>
                <a class="login-button" href="templates/logout.php">Logout</a>
            </div>
        <?php else: ?>
            <a class="login-button" href="templates/login.php">
                <h4>Log in/Sign up</h4>
            </a>
        <?php endif; ?>
    </header>

    <main>
        <?php if (!isset($_SESSION['user_id'])): ?>
            <div class="welcome-message">
                <h2>Learn Smarter with Digital Flashcards</h2>
                <p>Welcome to your personal learning companion! With our digital flashcards, you'll make learning more efficient and successful. Whether it's vocabulary, formulas, or facts - create your own flashcards and watch as you'll improve.</p>
                <p>How it works: Create cards with questions and answers and study at your own pace.</p>
                <p>Start now and discover how simple effective learning can be!</p>
            </div>
        <?php endif; ?>

        <div class="container">
            <?php if (isset($_SESSION['user_id'])): ?>
                <div class="add-flashcard-con">
                    <button id="add-flashcard">Add Flashcard</button>
                    <button id="toggle-view-btn" class="hide">Show All</button>
                </div>
            <?php endif; ?>

            <div id="card-con">
                <div class="card-list-container">
                    <?php if (count($flashcards) === 0): ?>
                        <!-- <p>Du hast noch keine Flashcards.</p> -->
                    <?php else: ?>
                        <?php foreach ($flashcards as $index => $card): ?>
                            <div class="card" data-id="<?= $card['Card_ID'] ?>" data-kategorie-id="<?= $card['Kategorie_ID'] ?>">
                                <p class="question-div"><?= htmlspecialchars($card['Frage']) ?></p>

                                <a class="show-hide-btn">Show</a>
                                <p class="answer-div hide"><?= nl2br(htmlspecialchars($card['Antwort'])) ?></p>

                                <div class="buttons-con">
                                    <button class="card-prev-btn nav-btn" style="<?= $index === 0 ? 'display: none;' : '' ?>" title="Previous">
                                        <i class="fa-solid fa-angle-left"></i>
                                    </button>
                                    <button class="card-next-btn nav-btn" style="<?= $index === count($flashcards) - 1 ? 'display: none;' : '' ?>" title="Next">
                                        <i class="fa-solid fa-angle-right"></i>
                                    </button>

                                    <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <div class="question-container hide" id="add-question-card">
            <h2>Add Flashcard</h2>
            <div class="wrapper">
                <!-- Error Message -->
                <div class="error-con">
                    <span class="hide" id="error">Input fields cannot be empty!</span>
                </div>
                <!-- Close Button -->
                <i class="fa-solid fa-xmark" id="close-btn"></i>
            </div>

            <label for="kategorie">Kategorie:</label>
            <select name="kategorie" id="kategorie">
                <?php
                include 'templates/kategorie.php'
                ?>
            </select>

            <label for="question">Question:</label>
            <textarea class="input" id="question" placeholder="Type question here..." rows="2"></textarea>
            <label for="answer">Answer:</label>
            <textarea class="input" id="answer" rows="4" placeholder="Type answer here..."></textarea>
            <button id="save-btn">Save</button>
        </div>
        
    </main>
    <script src="assets/js/script.js"></script>
    <script>
        const isLoggedIn = <?= isset($_SESSION['user_id']) ? 'true' : 'false' ?>;
    </script>
    <div id="delete-confirmation-modal" class="modal hide">
    <div class="modal-content">
        <p>Möchtest du diese Flashcard wirklich löschen?</p>
        <div class="modal-buttons">
            <button id="confirm-delete-btn">Ja</button>
            <button id="cancel-delete-btn">Nein</button>
        </div>
    </div>
</div>
</body>

</html>