<?php
require_once(__DIR__ . '/../config/dbaccess.php');

$sql = "SELECT Bezeichnung FROM Kategorie";
$result = $conn->query($sql);

if ($result->num_rows > 0) 
{
    while($row = $result->fetch_assoc())
    {
        echo "<option value=\"" . htmlspecialchars($row["Bezeichnung"]) . "\">" . htmlspecialchars($row["Bezeichnung"]) . "</option>";
    }
}
else 
{
    echo "<option>Keine Kategorien gefunden</option>";
}

$conn->close();
?>