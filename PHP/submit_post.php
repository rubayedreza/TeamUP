<?php
    session_start();
    include 'connection.php';

    // Ensure the user is logged in
    if (!isset($_SESSION['uid'])) {
        header("Location: ../HTML/login.html");
        exit();
    }

    // Get the user ID from the session
    $user_id = $_SESSION['uid'];

    // Get data from the form
    $project_title = $_POST['project_title'];
    $project_description = $_POST['project_description'];
    $team_size = $_POST['team_size'];
    $contact_email = $_POST['contact_email'];

    // --- Handling Skills ---
    $skills_array = isset($_POST['skills']) ? (array) $_POST['skills'] : [];
    $other_skills = isset($_POST['other_skills']) && !empty($_POST['other_skills']) ? $_POST['other_skills'] : '';

    // Combine skills from checkboxes and the 'other' text box
    $all_skills = $skills_array;
    if (!empty($other_skills)) {
        // Split other skills by comma and add to the array
        $other_skills_array = array_map('trim', explode(',', $other_skills));
        $all_skills = array_merge($all_skills, $other_skills_array);
    }
    
    // Convert the final skills array to a comma-separated string
    $required_skills_string = implode(", ", $all_skills);
    // --- End of Skills Handling ---


    // Use prepared statements to prevent SQL injection
    $sql = "INSERT INTO posts (user_id, project_title, project_description, required_skills, team_size, contact_email) VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($con, $sql);

    // Bind the data to the statement
    mysqli_stmt_bind_param($stmt, "isssis", $user_id, $project_title, $project_description, $required_skills_string, $team_size, $contact_email);

    // Execute the statement
    if (mysqli_stmt_execute($stmt)) {
        // Redirect to the dashboard on successful post creation
        header("Location: ../HTML/dashboard.php?post_success=true");
        exit();
    } else {
        // Handle errors
        echo "Error: " . mysqli_error($con);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($con);
?>
