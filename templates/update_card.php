<?php
session_start();
header('Content-Type: application/json');
require_once("../config/dbaccess.php");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$card_id = $_POST['card_id'] ?? null;
$frage = $_POST['frage'] ?? null;
$antwort = $_POST['antwort'] ?? null;
$kategorie = $_POST['kategorie'] ?? null;

if (!$card_id || !$frage || !$antwort || !$kategorie) {
    echo json_encode(["status" => "error", "message" => "Missing fields."]);
    exit;
}

$sql = "UPDATE card SET Frage = ?, Antwort = ?, Kategorie_ID = ? WHERE Card_ID = ? AND User_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssiii", $frage, $antwort, $kategorie, $card_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
