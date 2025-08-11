<?php
    include '../PHP/connection.php';
    session_start();

    // Check if a profile ID is provided in the URL
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        // Redirect to dashboard if no ID is provided
        header("Location: dashboard.php");
        exit();
    }

    $profile_id = $_GET['id'];
    $current_user_id = $_SESSION['uid'] ?? null;

    // Fetch the profile user's data
    $profile_sql = "SELECT * FROM register_info WHERE id = ?";
    $profile_stmt = mysqli_prepare($con, $profile_sql);
    mysqli_stmt_bind_param($profile_stmt, "i", $profile_id);
    mysqli_stmt_execute($profile_stmt);
    $profile_result = mysqli_stmt_get_result($profile_stmt);

    if (mysqli_num_rows($profile_result) == 0) {
        // If no user is found, redirect
        echo "User not found.";
        exit();
    }
    $profile_user = mysqli_fetch_assoc($profile_result);

    // Fetch the logged-in user's data for the header
    $nav_user = null;
    if ($current_user_id) {
        $nav_sql = "SELECT first_name, last_name, department FROM register_info WHERE id = ?";
        $nav_stmt = mysqli_prepare($con, $nav_sql);
        mysqli_stmt_bind_param($nav_stmt, "i", $current_user_id);
        mysqli_stmt_execute($nav_stmt);
        $nav_result = mysqli_stmt_get_result($nav_stmt);
        $nav_user = mysqli_fetch_assoc($nav_result);
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($profile_user['first_name']); ?>'s Profile - TeamUp DIU</title>
    <link rel="stylesheet" href="../CSS/dashboard.css"> <!-- Reusing dashboard styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        .profile-skills { margin-top: 1.5rem; }
        .profile-skills h3 { font-size: 1.2rem; margin-bottom: 1rem; color: #e5e7eb; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .skill-tag { background: rgba(99, 102, 241, 0.2); color: #c7d2fe; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 500; }
    </style>
</head>
<body>
    <!-- Navigation Header -->
    <nav class="dashboard-nav">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="../index.php" class="brand-logo">
                    <img src="../img/TeamUp.png" alt="TeamUp DIU Logo" class="logo-icon">
                    <span class="logo-text">TeamUp DIU</span>
                </a>
            </div>
            <?php if ($nav_user): ?>
            <div class="nav-user">
                <div class="user-avatar">
                    <span class="avatar-initials"><?php echo htmlspecialchars($nav_user['first_name'][0] . $nav_user['last_name'][0]); ?></span>
                </div>
                <a href="dashboard.php" style="color: white; text-decoration: none; font-weight: 500;">Dashboard</a>
                <a href="../PHP/logout.php" class="btn btn-sm btn-danger" style="text-decoration: none;">Logout</a>
            </div>
            <?php else: ?>
            <div class="nav-links">
                 <a href="login.html" class="nav-cta">Sign In</a>
            </div>
            <?php endif; ?>
        </div>
    </nav>

    <!-- Profile Section -->
    <section class="profile-section" style="margin-top: 2rem;">
        <div class="profile-container row-layout">
            <div class="profile-photo-wrapper">
                <img src="../img/TeamUp.jpg" alt="Profile Photo" class="profile-photo">
            </div>
            <div class="profile-info">
                <h2 class="profile-name"><?php echo htmlspecialchars($profile_user['first_name'] . ' ' . $profile_user['last_name']); ?></h2>
                <p class="profile-department"><?php echo htmlspecialchars($profile_user['department']); ?></p>
                <p class="profile-email"><?php echo htmlspecialchars($profile_user['email']); ?></p>
                <p class="profile-semester"><?php echo htmlspecialchars($profile_user['semester']); ?> Semester</p>
                <p class="profile-id">Student ID: <?php echo htmlspecialchars($profile_user['student_id']); ?></p>
                
                <div class="profile-skills">
                    <h3>Skills & Interests</h3>
                    <div class="skills-list">
                        <?php 
                            $skills = explode(',', $profile_user['skills']);
                            if (!empty($profile_user['other_skills'])) {
                                $skills[] = $profile_user['other_skills'];
                            }
                            
                            foreach ($skills as $skill):
                                if (!empty(trim($skill))):
                        ?>
                            <span class="skill-tag"><?php echo htmlspecialchars(trim($skill)); ?></span>
                        <?php 
                                endif;
                            endforeach; 
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

</body>
</html>
