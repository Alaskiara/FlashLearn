<?php
session_start();
require_once(__DIR__ . '/../config/dbaccess.php');

if (!isset($_SESSION['user_id'])) {
    // Falls der User nicht eingeloggt ist
    header("Location: templates/login.php");
    exit;
}

$user_id = $_SESSION['user_id'];

// Antworten prüfen
$anzahl_richtig = 0;

if (isset($_POST['antwort']) && is_array($_POST['antwort'])) {
    foreach ($_POST['antwort'] as $frage_id => $antwort) {
        if ($antwort === 'richtig') {
            $anzahl_richtig++;
        }
    }
}

// Punkte in DB erhöhen
if ($anzahl_richtig > 0) {
    $sql = "UPDATE user SET punkte = punkte + ? WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $anzahl_richtig, $user_id);
    $stmt->execute();
    $stmt->close();
}

// Optional: Feedback oder Weiterleitung
header("Location: /flashlearn/index.php");
exit;