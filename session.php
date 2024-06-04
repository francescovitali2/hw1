<?php
    require_once 'dbconfig.php';
    session_start();

    function checkSession() {
        if(isset($_SESSION['user'])) {
            return $_SESSION['user'];
        } else {
            return 0;
        }
    }
?>