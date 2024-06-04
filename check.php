<?php
    require_once 'dbconfig.php';

    if (!isset($_GET["q"]) || !isset($_GET["value"])) {
        echo json_encode("Impossibile raggiungere la pagina");
        exit;
    }

    header('Content-Type: application/json');
    $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
    $selector = mysqli_real_escape_string($conn, $_GET["q"]);
    $value = mysqli_real_escape_string($conn, $_GET["value"]);

    if($selector=='email'){
        $query = "SELECT email FROM users WHERE email = '$value'";
    } else if($selector=='username'){
        $query = "SELECT username FROM users WHERE username = '$value'";
    } else {
        echo json_encode(array('exists' => null));
    }

    $res = mysqli_query($conn, $query) or die(mysqli_error($conn));

    echo json_encode(array('exists' => mysqli_num_rows($res) > 0 ? true : false));

    mysqli_close($conn);
?>