<?php
$host = 'localhost';
$database = 'flashlearn';
$user = 'flashlearn-app';
$password = 'flashlearn24hgs';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) 
{
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
?>