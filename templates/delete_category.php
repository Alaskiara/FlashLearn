<?php
session_start();
require_once("../config/dbaccess.php");

if (!isset($_SESSION['user_id'])) {
    echo "error:Not logged in.";
    exit;
}

$category_id = $_POST['category_id'] ?? '';
$user_id = $_SESSION['user_id'];

if (empty($category_id)) {
    echo "error:Category ID is required";
    exit;
}

// Start transaction
$conn->begin_transaction();

try {
    // Delete all flashcards in this category
    $sql = "DELETE FROM card WHERE Kategorie_ID = ? AND User_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $category_id, $user_id);
    $stmt->execute();

    // Delete the category
    $sql = "DELETE FROM kategorie WHERE Kategorie_ID = ? AND User_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $category_id, $user_id);
    $stmt->execute();

    // Commit transaction
    $conn->commit();
    echo "success";
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    echo "error:" . $e->getMessage();
}

$stmt->close();
$conn->close();
?>