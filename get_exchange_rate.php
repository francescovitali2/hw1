<?php
    require_once 'session.php';
    if(!checkSession()) exit;

    $apiKey = '542fdb6512340bbc3d240494';
    $url = "https://v6.exchangerate-api.com/v6/$apiKey/latest/EUR";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    $data = json_decode($response, true);
    curl_close($ch);

    echo $data['conversion_rates']['USD'];
?>
