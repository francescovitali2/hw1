<?php 
    require_once 'session.php';
    if(!$username = checkSession()) exit;

    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);

    $username = mysqli_real_escape_string($conn, $username);
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $size = mysqli_real_escape_string($conn, $_POST['size']);
    $quantity = mysqli_real_escape_string($conn, $_POST['quantity']);

    if (isset($_POST['action'])) {
        $action = $_POST['action'];

        if ($action === 'delete') {
            $delete_query = "DELETE FROM cart WHERE username = '$username' AND product = '$id' AND size ='$size'";
            if(mysqli_query($conn, $delete_query) or die(mysqli_error($conn))) {
                $update_inventory_query = "UPDATE inventory SET quantity = quantity + $quantity WHERE product_id = '$id' AND size = '$size'";
                if (mysqli_query($conn, $update_inventory_query) or die(mysqli_error($conn))) {
                    echo json_encode(array('ok' => true));
                    exit;
                }
            }
        } elseif ($action === 'decrement') {
            $update_cart_query = "UPDATE cart SET quantity = quantity - 1 WHERE username = '$username' AND product = '$id' AND size = '$size'";
            if(mysqli_query($conn, $update_cart_query) or die(mysqli_error($conn))) {
                if ($quantity > 1) {
                    $update_inventory_query = "UPDATE inventory SET quantity = quantity + 1 WHERE product_id = '$id' AND size = '$size'";
                    if (mysqli_query($conn, $update_inventory_query) or die(mysqli_error($conn))) {
                        $query_total_quantity = "SELECT quantity AS total_quantity FROM inventory WHERE product_id = '$id' AND size = '$size'";
                        $result_total_quantity = mysqli_query($conn, $query_total_quantity);
                        $row_total_quantity = mysqli_fetch_assoc($result_total_quantity);
                        $total_quantity = $row_total_quantity['total_quantity'];
                        echo json_encode(array('ok' => true, 'total_quantity' => $total_quantity));
                        exit;
                    }
                } else {
                    $delete_query = "DELETE FROM cart WHERE username = '$username' AND product = '$id' AND size ='$size'";
                    if(mysqli_query($conn, $delete_query) or die(mysqli_error($conn))) {
                        $update_inventory_query = "UPDATE inventory SET quantity = quantity + 1 WHERE product_id = '$id' AND size = '$size'";
                        if (mysqli_query($conn, $update_inventory_query) or die(mysqli_error($conn))) {
                            echo json_encode(array('ok' => true));
                            exit;
                        }
                    }
                }
            }
        }
    }

    mysqli_close($conn);
    echo json_encode(array('ok' => false));
?>
