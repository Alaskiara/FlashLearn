<?php
session_start();
$meldung = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    require_once("../config/dbaccess.php");

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
            header("Location: ../index.php");
            // exit;
        } 
        else 
        {
            $meldung = "Wrong Password.";
        }
    } 
    else 
    {
        $meldung = "Username not found.";
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
  <link rel="stylesheet" href="../assets/css/stylesheet.css">
</head>
<body>
  <?php include '../includes/header.php'; ?>
  <main>
  <div class="login-container">
    <h1>Login</h1>
    <form method="post" action="login.php" autocomplete="off">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" autocomplete="off" required />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="new-password" required />
      <a href="signup.php">Don't have a user yet? Sign up here!</a>
      <input type="submit" value="Login" />
      <?php if (!empty($meldung)) echo "<p>$meldung</p>"; ?>
    </form>
  </div>
  </main>
</body>
</html>
