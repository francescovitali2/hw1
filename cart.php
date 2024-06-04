<?php 
    require_once 'session.php';

    if (!$username=checkSession()) {
        header("Location: login.php");
        exit;
    }
?>

<!DOCTYPE html>
<html>
    <?php
        $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);

        $username = mysqli_real_escape_string($conn, $username);

        $query = "SELECT * FROM users WHERE username = '$username'";
        $res = mysqli_query($conn, $query);

        $userinfo = mysqli_fetch_assoc($res);
    ?>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>EVERLANE</title>
    <link rel="stylesheet" href="cart.css"/>
    <script src="cart.js" defer></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div class="header_cont">
        <nav class="menu">
          <a>Woman</a>
          <a>Man</a>
          <a>About</a>
          <a>Everworld Stories</a>
          <a href="home.php">Home</a>
          <div id="user">
            <img src="./pictures/user.png" id="userIcon" class="icon">
            <div id="popup" class="hidden">
              <span><?php echo $username ?></span>
              <a href="logout.php">Logout</a>
            </div>
          </div>
          <div id="hamburger">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </nav>
        <header class="header">
            <h1>Everlane</h1>
        </header>
    </div>
    <div id="riepilogo">
      <h2>Your cart:</h2>
      <div class="left">
        <div id="totale-elementi"></div>
        <div id="totale-prezzo"></div>
      </div>
    </div>

    <div class="prodotti_cat">
      <ul id="listaProdotti"></ul>
    </div>

    <div id="notification"></div>

    <footer>
      <p>2024 Everlane. All rights reserved.</p>
    </footer>
    
</body>
</html>