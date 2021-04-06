<?php


//connect to mysql
$conn = mysqli_connect('localhost','root','1234','messageapp');

//test connection
if(mysqli_connect_errno()){
    echo 'DB Connection Error: '.mysqli_connect_error();
}
?>