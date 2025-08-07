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
    $other_skills = $_POST['otherSkills'] ?? "";

    // Securely hash the password ---
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Use prepared statements to prevent SQL injection ---
    $sql = "INSERT INTO register_info (first_name, last_name, university, student_id, department, semester, email, password, skills, other_skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($con, $sql);

    // Bind the user data to the statement
    mysqli_stmt_bind_param($stmt, "ssssssssss", $first_name, $last_name, $university, $student_id, $department, $semester, $email, $hashed_password, $skills, $other_skills);

    // Execute the statement
    if (mysqli_stmt_execute($stmt)) {
        // Redirect to login page on successful registration
        header("Location: ../HTML/login.html");
        exit(); // CORRECTION 3: Always exit after a redirect ---
    } else {
        echo "Error: " . mysqli_error($con);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($con);
?>
