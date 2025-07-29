<?php
    include 'connection.php';

    $first_name = $_POST['firstName'];
    $last_name = $_POST['lastName'];
    $university = $_POST['university'];
    $student_id = $_POST['studentId'];
    $department = $_POST['department'];
    $semester = $_POST['semester'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $skillsArray = isset($_POST['skills']) ? (array) $_POST['skills'] : [];
    $skills = implode(", ", $skillsArray);
    // Ensure 'otherSkills' is set and not empty
    $other_skills = $_POST['otherSkills'] ?? "";

    $sql = "INSERT INTO register_info (first_name, last_name, university, student_id, department, semester, email, password, skills, other_skills) VALUES ('$first_name', '$last_name', '$university', '$student_id', '$department', '$semester', '$email', '$password', '$skills', '$other_skills')";
    $result = mysqli_query($con, $sql);
    if ($result) {
        echo "Registration successful";
        header("Location: ../HTML/login.html");
    } else {
        echo "Error: " . mysqli_error($con);
    }
?>