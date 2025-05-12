<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlashLearn</title>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"/>
    <link rel="stylesheet" href="stylesheet.css">
</head>
<body>
    <?php include 'header.php'; ?>

    <main>
        <div class="container">
            <div class="add-flashcard-con">
                <button id="add-flashcard">Add Flashcard</button>
            </div>

            <div id="card-con">
                <div class="card-list-container"></div>
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
                    include 'kategorie.php'
                ?>
            </select>
            
            <label for="question">Question:</label>
            <textarea class="input" id="question" placeholder="Type question here..." rows="2"></textarea>
            <label for="answer">Answer:</label>
            <textarea class="input" id="answer" rows="4" placeholder="Type answer here..."></textarea>
            <button id="save-btn">Save</button>
        </div>
        <script src="script.js"></script>
    </main>

</body>
</html>
