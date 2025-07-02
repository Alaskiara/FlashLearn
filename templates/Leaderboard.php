<?php
    session_start();
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard</title>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="../assets/css/stylesheet.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <main>
        <div>
            <?php
            $conn=new mysqli("localhost", "root", "", "flashlearn");
            if ($conn->connect_error) 
            {
                die("Verbindung fehlgeschlagen: " . $conn->connect_error);
            }
            else
            {
                $sql="SELECT User_ID, username, punkte FROM user ORDER BY punkte DESC";
                $result=$conn->query($sql);
                if ($result && $result->num_rows > 0) {
                    echo '<div class="leaderboard-table-container">';
                    echo '<table class="table table-striped table-hover leaderboard-table">';
                    echo '<tr><th>ID</th><th>Name</th><th>Points</th></tr>';
                    while ($row = $result->fetch_assoc()) {
                        echo '<tr>'
                            . '<td>' . htmlspecialchars($row['User_ID'])   . '</td>'
                            . '<td>' . htmlspecialchars($row['username']) . '</td>'
                            . '<td>' . htmlspecialchars($row['punkte']). '</td>'
                            . '</tr>';
                    }
                    echo '</table>';
                    echo '</div>';
                } else {
                    echo 'Keine Datensätze gefunden.';
                }
                $conn->close();
            }

            ?>
        </div>
    </main>
    
</body>
</html>

