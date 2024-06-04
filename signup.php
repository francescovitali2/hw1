<?php
    require_once 'session.php';

    if(checkSession()){
        header('Location: home.php');
        exit;
    }

    if (!empty($_POST["name"]) && !empty($_POST["lastname"]) && !empty($_POST["email"]) && !empty($_POST["username"]) && !empty($_POST["password"]) && !empty($_POST["confirm"])){
        $errors = array();

        $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']) or die(mysqli_error($conn));

        if(!preg_match('/^[a-zA-Z0-9-_.]{3,20}$/', $_POST['username'])) {
            $errors[] = "● Please use only letters, numbers, hyphens, underscores, and periods, with a length between 3 and 20 characters.";
        } else {
            $username = mysqli_real_escape_string($conn, $_POST['username']);
            $query = "SELECT username FROM users WHERE username = '$username'";
            $res = mysqli_query($conn, $query);
            if (mysqli_num_rows($res) > 0) {
                $errors[] = "● Username already in use";
            }
        }

        if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "● Email not valid";
        } else {
            $email = mysqli_real_escape_string($conn, strtolower($_POST['email']));
            $res = mysqli_query($conn, "SELECT email FROM users WHERE email = '$email'");
            if (mysqli_num_rows($res) > 0) {
                $errors[] = "● Email already in use";
            }
        }

        if (!preg_match('/^(?=.*[A-Z])(?=.*[._!@#$&*])(?=.*[0-9])(?=.{8,})/', $_POST['password'])) {
            $errors[] = "● Password must contain at least 8 characters, at least one uppercase letter, one number, and one special character";
        } 

        if (strcmp($_POST["password"], $_POST["confirm"]) != 0) {
            $errors[] = "● The passwords do not match";
        }

        if (count($errors) == 0) {
            $name = mysqli_real_escape_string($conn, $_POST['name']);
            $lastname = mysqli_real_escape_string($conn, $_POST['lastname']);
            $password = mysqli_real_escape_string($conn, $_POST['password']);
            $password = password_hash($password, PASSWORD_BCRYPT);

            $query = "INSERT INTO users (name, lastname, email, username, password) VALUES('$name', '$lastname', '$email', '$username', '$password')";
            
            if (mysqli_query($conn, $query)) {
                $_SESSION["user"] = $_POST["username"];
                mysqli_close($conn);
                header("Location: home.php");
                exit;
            } else {
                $errors[] = "Unable to connect to the database";
            }
        }
        mysqli_close($conn);
    }
?>

<html>
    <head>
        <meta charset="utf-8">
        <title>Sign up</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel='stylesheet' href='signup.css'>
        <script src='signup.js' defer></script>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <div id="container">
            <h1>Sign up</h1>
            <form name="signup" method="post">
                <div class="name">
                    <label for='name'>Name</label>
                    <input type='text' name='name' <?php if(isset($_POST["name"])){ echo "value=".$_POST["name"]; } ?> >
                    <span>● Insert name</span>
                </div>
                <div class="lastname">
                    <label for='lastname'>Last name</label>
                    <input type='text' name='lastname' <?php if(isset($_POST["lastname"])){ echo "value=".$_POST["lastname"];} ?> >
                    <span>● Insert last name</span>
                </div>
                <div class="username">
                    <label for='username'>Username</label>
                    <input type='text' name='username' <?php if(isset($_POST["username"])){echo "value=".$_POST["username"];} ?> >
                    <span>● Insert username</span>
                </div>
                <div class="email">
                    <label for='email'>Email</label>
                    <input type='text' name='email' <?php if(isset($_POST["email"])){ echo "value=".$_POST["email"]; } ?> >
                    <span>● Insert email</span>
                </div>
                <div class="password">
                    <label for='password'>Password</label>
                    <input type='password' name='password' class='short'>
                    <img src="./pictures/view.png" id="show">
                    <span>● Insert at least 8 characters</span>
                </div>
                <div class="confirm">
                    <label for='confirm'>Confirm password</label>
                    <input type='password' name='confirm' class='short'>
                    <img src="./pictures/view.png" id="show">
                    <span>● Confirm password</span>
                </div>
            </form>

            <?php if(isset($errors)) {
                    foreach($errors as $error) {
                        echo "<div class='php_error'>".$error."</div>";
                    }
                }
            ?>

            <input type='submit' value="Submit" id="submit">

            <div id="login">Already have an account?
                <a href="login.php">Login</a>
            </div>
        </div>
    </body>
</html>