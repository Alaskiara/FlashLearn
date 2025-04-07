<?php
$conn = new mysqli("localhost", "root", "", "flashlearn");

if ($conn->connect_error) 
{
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
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