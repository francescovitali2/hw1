<?php 
    require_once 'session.php';

    if (!$username = checkSession()) {
        header("Location: login.php");
        exit;
    }

    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $username = mysqli_real_escape_string($conn, $username);

    $query = "SELECT p.*, c.size, c.quantity
    FROM products p
    JOIN cart c ON p.id = c.product
    WHERE c.username = '$username'";

    $res = mysqli_query($conn, $query) or die(mysqli_error($conn));

    $productsArray = array();
    while ($entry = mysqli_fetch_assoc($res)) {
        $productsArray[] = $entry;
    }
    echo json_encode($productsArray);

    mysqli_close($conn);
?>


