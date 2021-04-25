<?php include 'partials/menu.php' ; ?>

<div class="main-content">
    <div class="wrapper">
        <h1>Add Admin Section</h1>
        <br><br>

        <?php
            if(isset($_SESSION['add']))
            {
                echo $_SESSION['add'];
                unset($_SESSION['add']);
            }
        ?>

        <br><br>
        <form action="" method="POST">
            <table class="tbl-30">
                <tr>
                    <td>Full Name</td>
                    <td><br><input type="text" name="full_name" placeholder="Enter Your Name"></td>
                </tr>

                <tr>
                    <td>Username</td>
                    <td>
                        <br><input type="text" name="username" placeholder="Enter Your Username">
                    </td>
                </tr>

                <tr>
                    <td>Password</td>
                    <td>
                        <br><input type="password" name="password" placeholder="Enter Valid Password">
                    </td>
                </tr>
                
                <tr>
                    <td colspan="2">
                        <br><input type="Submit" name='submit' vlaue='Add Admin' class="btn-secondary">
                    </td>
                </tr>
            </table>
        </form>
    </div>
</div>

<?php include 'partials/footer.php' ; ?>

<?php
    //process the value from form and save it in database
    //check whether the submit button is clicked or not
    if(isset($_POST['submit']))
    {
        //Button Clicked else not clicked
        //echo 'Button Clicked';

        //get the data from our form
        $full_name = $_POST['full_name'];
        $username = $_POST['username'];
        $password = md5($_POST['password']); //password Encryption with md5

        //sql query to save the data into the database
        $sql = "INSERT INTO tbl_admin SET
            full_name = '$full_name',
            username = '$username',
            password = '$password'
        ";

        //execute query and saving data into db
        $res = mysqli_query($conn,$sql) or die(mysqli_error());

        //check whether the data is inserted or not
        //display appropriate msg
        if($res==TRUE){
            //data inserted
            //echo 'data insertd';
            //create session
            $_SESSION['add'] = 'Admin Added Successfully';
            //redirect page
            header('location:'.HOMESITE_URL.'admin/manage-admin.php');
        }
        else{
            //create session
            $_SESSION['add'] = 'Failed to add admin';
            //redirect page
            header('location:'.HOMESITE_URL.'admin/add-admin.php');
        }
        
    }
?>