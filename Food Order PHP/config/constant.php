<?php 
        //start session
        session_start();

        //create constants to store non repeating values
        define('HOMESITE_URL','https://localhost/food_order/');
        define('LOCALHOST','localhost');
        define('DB_USERNAME','root');
        define('DB_PASSWORD','1234');
        define('DB_NAME','food_order');
        

        //execute queries and save it to database. YOU have to give 
        //username and password when doing live project
        $conn = mysqli_connect(LOCALHOST,DB_USERNAME,DB_PASSWORD) or die(mysqli_error()); //db connection
        $db_select = mysqli_select_db($conn,DB_NAME) or die(mysqli_error()); //db selection

?>