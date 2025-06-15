<?php
session_start();
$meldung = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    require_once("../config/dbaccess.php");

    $user = $_POST['username'];
    $pass = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Benutzername prüfen (optional, aber empfehlenswert)
    $check = $conn->prepare("SELECT USER_ID FROM user WHERE username = ?");
    $check->bind_param("s", $user);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) 
    {
        $meldung = "Benutzername existiert bereits.";
    } 
    else 
    {
        $stmt = $conn->prepare("INSERT INTO user (username, passwort, punkte) VALUES (?, ?, ?)");
        $punkte = 0;
        $stmt->bind_param("ssi", $user, $pass, $punkte);
        if ($stmt->execute()) 
        {
            $meldung = "Registrierung erfolgreich! <a href='login.php'>Zum Login</a>";
        } else 
        {
            $meldung = "Fehler: " . $stmt->error;
        }
        $stmt->close();
    }
    $check->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign up</title>
  <link rel="stylesheet" href="../assets/css/stylesheet.css">
</head>
<body>
  <header>
  <?php include '../includes/header.php'; ?>
  </header>
  <main>
  <div class="signup-container">
    <h1>Sign up</h1>
    <form method="post" action="signup.php" autocomplete="off">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" autocomplete="off" required />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="new-password" required />
      <a href="login.php">Already have a user? Login here!</a>
      <input type="submit" value="Signup" />
      <?php if (!empty($meldung)) echo "<p>$meldung</p>"; ?>
    </form>
  </div>
  </main>
</body>
</html>
