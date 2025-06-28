<?php 
    session_start();

    $old_password = $new_password = $new_password2 = "";
    $old_passwordErr = $new_passwordErr = $new_password2Err = $dbErr = "";

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
            
            $stmt = $conn->prepare("SELECT User_ID FROM user WHERE User_ID = ? AND passwort = ?");
            $old_password_hash = password_hash($old_password, PASSWORD_DEFAULT);
            $stmt->bind_param("is", $_SESSION["user_id"], $old_password_hash);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows !== 1) {
                $old_passwordErr = "Invalid current password!";
                $err = true;
            } else {
                $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
                $update_stmt = $conn->prepare("UPDATE user SET passwort = ? WHERE User_ID = ?");
                $update_stmt->bind_param("si", $new_password_hash, $_SESSION["user_id"]);
                
                if ($update_stmt->execute()) {
                    header("Location: ../index.php");
                    exit;
                } else {
                    $dbErr = "Error updating password";
                }
            }
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
        <title>Change password-Flashlearn</title>
        <link rel="stylesheet" href="assets/css/stylesheet.css">
    </head>
    <body>
        <div class="password-change-container">
            <h2>Change password</h2>
            <form method="POST" action="change_password.php" class="password-form">
                <label for="old_password">Current Password</label>
                <input type="password" id="old_password" name="old_password" value="<?= htmlspecialchars($old_password) ?>">
                <small class="error"><?= $old_passwordErr ?></small>

                <label for="new_password">New password</label>
                <input type="password" id="new_password" name="new_password" value="<?= htmlspecialchars($new_password) ?>">
                <small class="error"><?= $new_passwordErr ?></small>

                <label for="new_password2">Repeat new password</label>
                <input type="password" id="new_password2" name="new_password2" value="<?= htmlspecialchars($new_password2) ?>">
                <small class="error"><?= $new_password2Err ?></small>

                <button type="submit">Change password</button>
                <small class="error"><?= $dbErr ?></small>
            </form>
        </div>
    </body>
</html>