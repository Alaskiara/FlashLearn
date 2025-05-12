<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login-Seite</title>
  <link rel="stylesheet" href="stylesheet.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .login-container {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      width: 300px;
    }

    .login-container h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .login-container input[type="text"],
    .login-container input[type="password"] {
      width: 100%;
      padding: 0.5rem;
      margin: 0.5rem 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .login-container input[type="submit"] {
      width: 100%;
      padding: 0.5rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }

    .login-container input[type="submit"] {
      background-color: #4cadaf;
    }
  </style>
</head>
<body>
  <header>
    <h1>FlashLearn</h1>
    <a class="login-button" href="login.php"><h4>Log in/Sign up</h4></a>
  </header>
  <div class="login-container">
    <h1>Login</h1>
    <form method="post">
      <label for="username">Benutzername</label>
      <input type="text" id="username" name="username" required />
      <label for="password">Passwort</label>
      <input type="password" id="password" name="password" required />
      <a href="registrieren.php">Don't have an user yet? Sign up here!</a>
      <input type="submit" value="Einloggen" />
    </form>
  </div>
</body>
</html>
