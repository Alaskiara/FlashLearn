<link rel="stylesheet" href="../assets/css/stylesheet.css">
<header>
  <h1><a href="../index.php" class="logo-link">FlashLearn</a></h1>

  <?php 
  $current_page = basename($_SERVER['PHP_SELF']);
  if (isset($_SESSION['username'])): ?>
    <div class="login-info">
      <a class="login-button"><h4>You are logged in as: <strong><?= htmlspecialchars($_SESSION['username']) ?></strong></h4></a>
      <a class="login-button" href="../templates/logout.php">Logout</a>
    </div>
  <?php elseif ($current_page !== 'login.php' && $current_page !== 'signup.php'): ?>
    <a class="login-button" href="../templates/login.php"><h4>Login/Sign Up</h4></a>
  <?php endif; ?>
</header>