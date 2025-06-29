<?php
$in_subdirectory = strpos($_SERVER['PHP_SELF'], '/templates/') !== false;
$path_prefix = $in_subdirectory ? '../' : '';
?>
<link rel="stylesheet" href="<?php echo $path_prefix; ?>assets/css/stylesheet.css">
<header>
  <h1><a href="<?php echo $path_prefix; ?>index.php" class="logo-link">FlashLearn</a></h1>

  <?php 
  $current_page = basename($_SERVER['PHP_SELF']);
  if (isset($_SESSION['username'])): ?>
    <div class="login-info">
      <a class="login-button"><h4>You are logged in as: <strong><?= htmlspecialchars($_SESSION['username']) ?></strong></h4></a>
      <a class="login-button" href="<?php echo $path_prefix; ?>templates/logout.php">Logout</a>
    </div>
  <?php elseif ($current_page !== 'login.php' && $current_page !== 'signup.php'): ?>
    <a class="login-button" href="<?php echo $path_prefix; ?>templates/login.php"><h4>Login/Sign Up</h4></a>
  <?php endif; ?>
</header>