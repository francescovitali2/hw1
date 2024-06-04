<?php 
    require_once 'session.php';    
    if (!$username=checkSession()) exit;

    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);

    $username = mysqli_real_escape_string($conn, $username);
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $size = mysqli_real_escape_string($conn, $_POST['size']);
    $quantity = '1';

    $update_inventory_query = "UPDATE inventory SET quantity = quantity - 1 WHERE product_id = '$id' AND size = '$size'";
    mysqli_query($conn, $update_inventory_query);   

    $check_inventory_query = "SELECT quantity FROM inventory WHERE product_id = '$id' AND size = '$size'";
    $inventory_result = mysqli_query($conn, $check_inventory_query);
    $inventory_row = mysqli_fetch_assoc($inventory_result);
    $available_quantity = $inventory_row['quantity'];

    if ($available_quantity >= 0) {
        $query = "SELECT * FROM cart WHERE username = '$username' AND product = '$id' AND size = '$size'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        if(mysqli_num_rows($result) > 0) {
            $update_query = "UPDATE cart SET quantity = quantity + 1 WHERE username = '$username' AND product = '$id' AND size = '$size'";
        } else {
            $update_query = "INSERT INTO cart (product, size, quantity, username) VALUES('$id', '$size', '$quantity', '$username')";
        }

        if(mysqli_query($conn, $update_query) or die(mysqli_error($conn))) {
            $query_total_quantity = "SELECT SUM(quantity) AS total_quantity FROM cart WHERE username = '$username'";
            $result_total_quantity = mysqli_query($conn, $query_total_quantity);
            $row_total_quantity = mysqli_fetch_assoc($result_total_quantity);
            $total_quantity = $row_total_quantity['total_quantity'];

            echo json_encode(array('ok' => true, 'total_quantity' => $total_quantity));
            exit;
        }
    } else {
        $update_empty_inventory_query = "UPDATE inventory SET quantity = 0 WHERE product_id = '$id' AND size = '$size'";
        $inventory_result = mysqli_query($conn, $update_empty_inventory_query);
        echo json_encode(array('ok' => false, 'error_message' => 'Out of stock'));
        exit;
    }

    mysqli_close($conn);
    echo json_encode(array('ok' => false, 'error_message' => 'Error adding product to cart'));
?>
