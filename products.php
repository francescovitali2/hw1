<?php 
  require_once 'session.php';

  if (!$username=checkSession()) {
    header("Location: login.php");
    exit;
  }

  $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);

  if (isset($_GET['category'])) {
    $category = $_GET['category'];
    $query = "SELECT p.*, i.size, i.quantity FROM products p 
    LEFT JOIN inventory i ON p.id = i.product_id 
    WHERE p.category = '$category'";
    $res = mysqli_query($conn, $query) or die(mysqli_error($conn));

    $productsArray = array();
    while ($entry = mysqli_fetch_assoc($res)) {
      if (!isset($productsArray[$entry['id']])) {
          $productsArray[$entry['id']] = array(
              'id' => $entry['id'],
              'name' => $entry['name'],
              'description' => $entry['description'],
              'price' => $entry['price'],
              'image' => $entry['image'],
              'hover_image' => $entry['hover_image'],
              'sizes' => array()
          );
      }
      $productsArray[$entry['id']]['sizes'][$entry['size']] = $entry['quantity'];
    }
  };

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
    <script src="products.js" defer></script>
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
        </nav>
        <header class="header">
            <h1>Everlane</h1>
        </header>
    </div>

    <section class="prodotti_cat">
    <h1><?php echo $category ?></h1>
    <ul id="listaProdotti">
      <?php foreach ($productsArray as $product) { ?>
      <li style="cursor: default;" data-id="<?php echo $product['id'] ?>">
        <img src="<?php echo $product['image'] ?>" data-hover-image="<?php echo $product['hover_image'] ?>" class="product-image">
        <div id="info">
          <h3><?php echo $product['name'] ?></h3>
          <div class="prodotto-prezzo"><?php echo $product['price'] ?>€</div>
        </div>
        <p class="descrizione hidden"><?php echo $product['description'] ?></p>
        <span id="error">Please select a size</span>
        <div id="sizes">
          <?php
          $sizes = ['S', 'M', 'L'];
          foreach ($sizes as $size) {
            $emptyClass = (isset($product['sizes'][$size]) && $product['sizes'][$size] > 0) ? '' : 'empty';
            echo "<div class='size $emptyClass'>$size</div>";
          }
          ?>
        </div>
        <div id="tasti">
            <div class="tasto">Show More</div>
            <div class="cart-button"></div>
        </div>
      </li>
    <?php } ?>
  </ul>
  </section>

  <div id="notification"></div>

  <a href="home.php" id="backButton">⬅︎ Back</a>

  <footer>
    <p>2024 Everlane. All rights reserved.</p>
  </footer>
</body>
</html>