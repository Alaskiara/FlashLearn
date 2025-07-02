<?php
session_start();
require_once("../config/dbaccess.php");

if (!isset($_SESSION['user_id'])) {
    echo "error: not_logged_in";
    exit;
}

if (!isset($_POST['card_id'])) {
    echo "error: no_card_id";
    exit;
}

$card_id = intval($_POST['card_id']);
$user_id = $_SESSION['user_id'];

$sql = "DELETE FROM card WHERE Card_ID = ? AND User_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $card_id, $user_id);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: delete_failed";
}

$stmt->close();
$conn->close();
?>
