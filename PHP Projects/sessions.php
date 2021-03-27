<?php
    //start
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session - PHP</title>
</head>
<body>
    <?php
    //set session vars
    $_SESSION['username'] = 'devuser';
    $_SESSION['email'] = 'devuser@gmail.com';
    echo "Session vars set";
   ?>
</body>
</html>