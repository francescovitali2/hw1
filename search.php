<?php
    require_once 'session.php';    
    if (!$username=checkSession()) exit;

    header('Content-Type: application/json');
    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
    if($conn->connect_error){
        die("connection failed: " . $conn->connect_error);
    }

    $product = $_GET['q'];
    $query = "SELECT p.*, i.size, i.quantity FROM products p 
              LEFT JOIN inventory i ON p.id = i.product_id 
              WHERE p.name LIKE '%$product%'";
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
    mysqli_close($conn);
    echo json_encode($productsArray);
?>