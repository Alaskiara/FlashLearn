<?php
require_once(__DIR__ . '/../config/dbaccess.php');

if (isset($_SESSION['user_id'])) {
    $sql = "SELECT Kategorie_ID, Bezeichnung FROM kategorie WHERE User_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo '<option value="' . htmlspecialchars($row['Kategorie_ID']) . '">' . 
                 htmlspecialchars($row['Bezeichnung']) . '</option>';
        }
    } else {
        echo "<option value=''>No categories found</option>";
    }
    $stmt->close();
} else {
    echo "<option value=''>Please log in</option>";
}
$conn->close();
?>