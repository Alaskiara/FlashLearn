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
            require_once('config/dbaccess.php');
            $db_obj = new mysqli($host, $user, $password, $database);
            if ($db_obj->connect_error) {
                $dbErr = "Connection error: " . $db_obj->connect_error;
            } else {
                try {
                    $stmt = $db_obj->prepare("UPDATE user SET password_hash = SHA2(?, 256) WHERE id = ? AND password_hash = SHA2(?, 256)");
                    $stmt->bind_param("sis", $new_password, $_SESSION["id"], $old_password);
                    $stmt->execute();

                    if ($db_obj->affected_rows !== 1) {
                        $old_passwordErr = "Invalid current password!";
                        $err = true;
                    } else {
                        header("Location: index.php");
                        exit;
                    }

                } catch (mysqli_sql_exception $e) {
                    $dbErr = $e->getMessage();
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