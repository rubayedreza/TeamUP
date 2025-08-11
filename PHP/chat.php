<?php
session_start();
include '../PHP/connection.php';

$uid = $_SESSION['uid'];
$msg = $_POST['message'];

$sql = "SELECT first_name, last_name FROM register_info WHERE id = $uid";
$result = mysqli_query($con, $sql);
$user = mysqli_fetch_assoc($result);
$name = $user['first_name'] . ' ' . $user['last_name'];

$sql = "INSERT INTO chat_messages (uid, name, message) VALUES ('$uid', '$name', '$msg')";
$run = mysqli_query($con, $sql);
if ($run) {
    // Message sent successfully
    header("Location: ../HTML/dashboard.php");
    exit();
} else {
    // Error sending message
    echo "Error: " . mysqli_error($con);
}

?>