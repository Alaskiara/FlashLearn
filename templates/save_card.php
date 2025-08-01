<?php
session_start();
require_once("../config/dbaccess.php");

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_SESSION["user_id"])) {
    $frage = $_POST['frage'] ?? '';
    $antwort = $_POST['antwort'] ?? '';
    $kategorie = $_POST['kategorie'] ?? '';
    $user_id = $_SESSION['user_id'];
    $points = 1;

    if (!empty($frage) && !empty($antwort) && !empty($kategorie)) {
        $sql = "INSERT INTO card (User_ID, Frage, Antwort, points, Kategorie_ID) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("issii", $user_id, $frage, $antwort, $points, $kategorie);

        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "error:" . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "error:Missing fields";
    }
} else {
    echo "error:Unauthorized";
}
?>
