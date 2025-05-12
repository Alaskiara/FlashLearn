<?php
session_start();
$meldung = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    $servername = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "flashlearn";

    $conn = new mysqli($servername, $dbuser, $dbpass, $dbname);

    if ($conn->connect_error) 
    {
        die("Verbindung fehlgeschlagen: " . $conn->connect_error);
    }

    $user = $_POST['username'];
    $pass = $_POST['password'];

    $stmt = $conn->prepare("SELECT USER_ID, passwort FROM user WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 1) 
    {
        $stmt->bind_result($user_id, $hashed_pass);
        $stmt->fetch();

        if (password_verify($pass, $hashed_pass)) 
        {
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $user;
            header("Location: index.php");
            exit;
        } 
        else 
        {
            $meldung = "Falsches Passwort.";
        }
    } 
    else 
    {
        $meldung = "Benutzername nicht gefunden.";
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login</title>
  <link rel="stylesheet" href="stylesheet.css">
</head>
<body>
  <header>
    <h1>FlashLearn</h1>
    <a class="login-button" href="login.php"><h4>Log in/Sign up</h4></a>
  </header>
  <main>
  <div class="login-container">
    <h1>Login</h1>
    <form method="post">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />
      <a href="signup.php">Don't have an user yet? Sign up here!</a>
      <input type="submit" value="Login" />
    </form>
  </div>
  </main>
</body>
</html>
