<?php include 'partials/menu.php' ; ?>

    <!----Content Section starts---->
    <div class="main-content">
        <div class="wrapper">
            <h1>Manage Admin</h1>
            <br>

            <?php 
                if(isset($_SESSION['add']))
                {
                    echo $_SESSION['add']; //this is displaying msg
                    unset($_SESSION['add']); //this removing session msg
                }
            ?>

            <br><br>
            <!---Button to add Admin -->
            <a href="add-admin.php" class="btn-primary">Add Admin</a><br><br>
            
            <table class="tbl-full">
                <tr>
                    <th>Sr No</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Action</th>
                </tr>

                <?php 
                    //query to get all admin
                    $sql = "SELECT *FROM tbl_admin";
                    //execute query
                    $res = mysqli_query($conn,$sql);

                    //check whether the query is executed or not
                    if($res==TRUE)
                    {
                        //count rows to check db is empty or not
                        $count = mysqli_num_rows($res); //function to get all the rows in db

                        $sn=1; //create a variable and assign the value
                        //check the number of rows
                        if($count>0)
                        {
                            //we have data in db
                            while($rows=mysqli_fetch_assoc($res))
                            {
                                //using while loop to get all the data from db
                                //and while will execute as long as we have data in db

                                //get individual data
                                $id = $rows['id'];
                                $full_name = $rows['full_name'];
                                $username = $rows['username'];

                                //display the values in our table
                                ?>
                                <tr>
                                    <td><?php echo $sn++ ; ?></td>
                                    <td><?php echo $full_name; ?></td>
                                    <td><?php echo $username ; ?></td>
                                    <td>
                                        <a href="<?php echo HOMESITE_URL; ?>admin/update-password.php?id=<?php echo $id; ?>" class="btn-primary">Change Password</a>
                                        <a href="<?php echo HOMESITE_URL; ?>admin/update-admin.php?id=<?php echo $id; ?>" class="btn-secondary">Update Admin</a>
                                        <a href="<?php echo HOMESITE_URL; ?>admin/delete-admin.php?id=<?php echo $id; ?>" class="btn-danger">Delete Admin</a>
                                    </td>
                                </tr>

                                <?php
                            }
                        }
                        else{
                            //we do not have data in db
                        }
                    }
                
                ?>

            </table>
            <div class="clearfix"></div>
        </div>
    </div>
    <!----Content Section Ends---->

<?php include 'partials/footer.php'; ?>