<?php
    //start session
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
    
    echo $_SESSION['username']. 's email is '. $_SESSION['email'];
   ?>
</body>
</html>