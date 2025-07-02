<?php 
    session_start();

    // Redirect to login if not logged in
    if (!isset($_SESSION['user_id'])) {
        header("Location: login.php");
        exit;
    }

    $new_password = $new_password2 = "";
    $old_passwordErr = $new_passwordErr = $new_password2Err = $dbErr = "";
    $success_message = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $err = false;

        if (empty($_POST["old_password"])) {
            $old_passwordErr = "Password is required";
            $err = true;
        } else {
            $old_password = test_input($_POST["old_password"]);
        }

        if (empty($_POST["new_password"])) {
            $new_passwordErr = "New password is required";
            $err = true;
        } else {
            $new_password = test_input($_POST["new_password"]);
        }

        if (empty($_POST["new_password2"])) {
            $new_password2Err = "Please repeat password";
            $err = true;
        } else {
            $new_password2 = test_input($_POST["new_password2"]);
            if ($new_password !== $new_password2) {
                $new_password2Err = "Passwords do not match!";
                $err = true;
            }
        }

        if (!$err) {
            require_once('../config/dbaccess.php');
            
            // Get current password hash from database
            $stmt = $conn->prepare("SELECT passwort FROM user WHERE User_ID = ?");
            $stmt->bind_param("i", $_SESSION["user_id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 1) {
                $row = $result->fetch_assoc();
                $stored_password_hash = $row['passwort'];
                
                // Verify current password
                if (password_verify($old_password, $stored_password_hash)) {
                    // Update with new password
                    $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
                    $update_stmt = $conn->prepare("UPDATE user SET passwort = ? WHERE User_ID = ?");
                    $update_stmt->bind_param("si", $new_password_hash, $_SESSION["user_id"]);
                    
                    if ($update_stmt->execute()) {
                        $success_message = "Password successfully changed!";
                        $new_password = $new_password2 = "";
                    } else {
                        $dbErr = "Error updating password";
                    }
                    $update_stmt->close();
                } else {
                    $old_passwordErr = "Invalid current password!";
                }
            } else {
                $dbErr = "User not found";
            }
            $stmt->close();
            $conn->close();
        }
    }

    function test_input($data) {
        return htmlspecialchars(stripslashes(trim($data)));
    }
?>

<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Change Password - FlashLearn</title>
        <link rel="stylesheet" href="../assets/css/stylesheet.css">
    </head>
    <body>
        <?php include '../includes/header.php'; ?>
        
        <main>
            <div class="password-change-container">
                <h2>Change Password</h2>
                
                <?php if (!empty($success_message)): ?>
                    <div class="success-message">
                        <p><?= $success_message ?></p>
                    </div>
                <?php endif; ?>
                
                <form method="POST" action="change_password.php" class="password-form" autocomplete="off">
                    <label for="old_password">Current Password</label>
                    <input type="password" id="old_password" name="old_password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" readonly onfocus="this.removeAttribute('readonly');" required>
                    <small class="error"><?= $old_passwordErr ?></small>

                    <label for="new_password">New Password</label>
                    <input type="password" id="new_password" name="new_password" value="<?= htmlspecialchars($new_password) ?>" autocomplete="new-password" autocapitalize="off" autocorrect="off" spellcheck="false" required>
                    <small class="error"><?= $new_passwordErr ?></small>

                    <label for="new_password2">Repeat New Password</label>
                    <input type="password" id="new_password2" name="new_password2" value="<?= htmlspecialchars($new_password2) ?>" autocomplete="new-password" autocapitalize="off" autocorrect="off" spellcheck="false" required>
                    <small class="error"><?= $new_password2Err ?></small>

                    <button type="submit">Change Password</button>
                    <?php if (!empty($dbErr)): ?>
                        <small class="error"><?= $dbErr ?></small>
                    <?php endif; ?>
                </form>
                
                <div class="back-button-container">
                    <a href="../index.php" class="back-button">Back to Main Page</a>
                </div>
            </div>
        </main>
        
        <script>
        // Forcibly clear the current password field on page load
        document.addEventListener('DOMContentLoaded', function() {
            const oldPasswordField = document.getElementById('old_password');
            if (oldPasswordField) {
                oldPasswordField.value = '';
                // Clear it again after a short delay to override any autofill
                setTimeout(function() {
                    oldPasswordField.value = '';
                }, 100);
            }
        });
        </script>
    </body>
</html>