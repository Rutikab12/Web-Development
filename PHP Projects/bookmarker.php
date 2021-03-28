<?php
// Start Session
session_start();

if(isset($_POST['name'])){
	if(isset($_SESSION['bookmarks'])){
		$_SESSION['bookmarks'][$_POST['name']] = $_POST['url'];
	} else {
		$_SESSION['bookmarks'] =  Array($_POST['name'] => $_POST['url']);
	}
}

if(isset($_GET['action']) && $_GET['action'] == 'clear'){
	session_unset(); 
	session_destroy(); 
	header("Location: bookmarker.php");
}

if(isset($_GET['action']) && $_GET['action'] == 'delete'){
	echo $_GET['name'];
	unset($_SESSION['bookmarks'][$_GET['name']]);
	header("Location: bookmarker.php");
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookmarker - PHP</title>
    <link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.css">
    
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Bookmarker</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="bookmarker.php">Home</a>
        </li>
      </ul>
    </div>
    <ul class="nav navbar-nav navbar-right">
            <li><a href="bookmarker.php?action=clear">Clear All</a></li>
    </ul>
  </div>
</nav>

<!-----------------NAV BAR ENDS HERE -------------------------------->

<div class="container">
	<div class="row">
		<div class="col-md-7">
			<form class="well" method="POST" action="<?php $_SERVER['PHP_SELF']; ?>">
				<div class="form-group">
				<label>Website Name: </label>
				<input class="form-control" type="text" name="name">
				</div>
				<div class="form-group">
				<label>Website URL: </label>
				<input class="form-control" type="text" name="url">
				</div>
				<input class="btn btn-default" type="submit" value="submit">
			</form>
		</div>
		<div class="col-md-5">
			<?php if(isset($_SESSION['bookmarks'])): ?>
				<ul class="list-group">
					<?php foreach($_SESSION['bookmarks'] as $name => $url) : ?>
						<li class="list-group-item"><a href="<?php echo $url; ?>"><?php echo $name; ?></a> <a class="delete" href="bookmarker.php?action=delete&name=<?php echo $name; ?>">[X]</a></li>
					<?php endforeach; ?>
				</ul>
			<?php else : ?>
				<p>No Bookmarks</p>
			<?php endif; ?>
		</div>
	</div>
</div>


</body>
</html>
