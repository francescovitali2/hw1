<?php 
    require_once 'session.php';

    if (!$username=checkSession()) {
        header("Location: login.php");
        exit;
    }
  
    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
    $query = "SELECT SUM(quantity) AS total_quantity FROM cart WHERE username = '$username'";
    $result = $conn->query($query);
  
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $total = $row["total_quantity"];
      }
    } else {
      $total = 0;
    }
    $conn->close();
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>EVERLANE</title>
    <link rel="stylesheet" href="home.css"/>
    <script src="home.js?version=3" defer></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div class="header_cont">
        <nav class="menu">
          <a>Woman</a>
          <a>Man</a>
          <a>About</a>
          <a>Everworld Stories</a>
          <a href="cart.php">
            <img src="./pictures/cart.png" id="cart" class="icon">
            <span id="number" <?php if($total == 0): ?> style="display: none;" <?php endif; ?>><?php echo $total ?></span>
          </a>
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
          <div id="searchContainer">
            <img src="./pictures/search.png" id="searchIcon">
            <input type="text" id="searchBar" class="hidden" placeholder="Search">
          </div>
          <h1>Everlane</h1>
        </header>
    </div>

    <section class="principale">
      <div class="sovrapposizione">
        <h2>Happy New Gear</h2>
        <p>Flexible, comfort-driven styles,<br/> designed for every more</p>
        <a class="tasto" href="home.php">SHOP NOW</a>
      </div>
    </section>
    
    <section class="prodotti_cat">
      <h2>Shop by Category</h2>
      <ul id="listaProdotti"></ul>
      <button id="convertButton">Convert to USD</button>
    </section>

    <section class="prodotti_cat" id="risultati">
      <ul id="listaRisultati"><ul>
    </section>

    <div id="notification"></div>
    
    <footer>
      <p>2024 Everlane. All rights reserved.</p>
    </footer>
</body>
</html>
