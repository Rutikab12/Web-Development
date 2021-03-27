<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register form</title>
    <link rel='stylesheet' href="http://www.w3schools.com/lib/w3.css">
</head>
<body>
    <div class='w3-card w3-margin w3-padding'>
    <?php if(isset($_GET['error'])): ?>
        <div class="w3-panel w3-red">
            <p><?php echo $_GET['error']; ?></p>
        </div>
    <?php endif; ?>
    <h1>Register</h1>
    <form class='w3-container' method="Post" action="data.php">
    <label class='w3-label w3-text-class'>First Name</label>
    <input class='w3-input w3-border' name="first_name" type='text'>
    <br>

    <label class='w3-label w3-text-class'>Last Name</label>
    <input class='w3-input w3-border' name="last_name" type='text'>
    <br>

    <label class='w3-label w3-text-class'>Email</label>
    <input class='w3-input w3-border'  name="email" type='text'>
    <br>

    <label class='w3-label w3-text-class'>Location</label>
    <select class="w3-input w3-border" name="location">
        <option value="Location 1">Location 1</option>
        <option value="Location 2">Location 2</option>
        <option value="Location 3">Location 3</option>
    </select>
    <br>

    <input type="submit" value='Submit'>
    </form>
    </div>
</body>
</html>