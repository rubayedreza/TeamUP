<?php
    include 'connection.php';


    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $university = $_POST['university'];
    $studentId = $_POST['studentId'];
    $department = $_POST['department'];
    $semester = $_POST['semester'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $skills = $_POST['skills'];
    $otherskills = $_POST['otherskills'];

    $sql = "INSERT INTO registration_info (first_name, last_name, university, student_id, department, semester, email, password, confirmPassword, skills, otherskills) VALUES ('$firstName', '$lastName', '$university', '$studentId', '$department', '$semester', '$email', '$password', '$confirmPassword', '$skills', '$otherskills')";
    $result = mysqli_query($con, $sql);
    if ($result) {
        echo "Registration successful";
        header("Location: ../HTML/login.html");
    } else {
        echo "Error: " . mysqli_error($con);
    }
?>