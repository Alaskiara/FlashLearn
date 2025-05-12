<header>
  <h1>FlashLearn</h1>

  <?php if (isset($_SESSION['username'])): ?>
    <div class="login-info">
      <a class="login-button"><h4>Du bist eingeloggt als: <strong><?= htmlspecialchars($_SESSION['username']) ?></strong></h4></a>
      <a class="login-button" href="logout.php">Logout</a>
    </div>
  <?php else: ?>
    <a class="login-button" href="login.php"><h4>Log in/Sign up</h4></a>
  <?php endif; ?>
</header>