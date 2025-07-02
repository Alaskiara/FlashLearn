<?php
session_start();
require_once("../config/dbaccess.php");

if (!isset($_SESSION['user_id'])) {
    echo "error:Not logged in.";
    exit;
}

$category_name = $_POST['name'] ?? '';
$user_id = $_SESSION['user_id'];

if (empty($category_name)) {
    echo "error:Category name is required";
    exit;
}

$sql = "INSERT INTO kategorie (Bezeichnung, User_ID) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $category_name, $user_id);

if ($stmt->execute()) {
    $new_category_id = $conn->insert_id;
    echo "success:" . $new_category_id . ":" . htmlspecialchars($category_name);
} else {
    echo "error:" . $stmt->error;
}
?>