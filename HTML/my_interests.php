<?php
    include '../PHP/connection.php';
    session_start();
    
    // Ensure the user is logged in
    if (!isset($_SESSION['uid'])) {
        header("Location: ../HTML/login.html");
        exit();
    }
    $uid = $_SESSION['uid'];

    // Fetch user data for the header display
    $user_sql = "SELECT * FROM register_info WHERE id = ?";
    $user_stmt = mysqli_prepare($con, $user_sql);
    mysqli_stmt_bind_param($user_stmt, "i", $uid);
    mysqli_stmt_execute($user_stmt);
    $user_result = mysqli_stmt_get_result($user_stmt);
    $user = mysqli_fetch_assoc($user_result);

    // Fetch posts that the logged-in user has shown interest in
    $posts_sql = "SELECT posts.*, register_info.first_name, register_info.last_name 
                  FROM posts 
                  JOIN register_info ON posts.user_id = register_info.id 
                  JOIN interests ON posts.id = interests.post_id
                  WHERE interests.user_id = ?
                  ORDER BY interests.created_at DESC";
    $posts_stmt = mysqli_prepare($con, $posts_sql);
    mysqli_stmt_bind_param($posts_stmt, "i", $uid);
    mysqli_stmt_execute($posts_stmt);
    $posts_result = mysqli_stmt_get_result($posts_stmt);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Interests - TeamUp DIU</title>
    <link rel="stylesheet" href="../CSS/dashboard.css"> <!-- Reusing dashboard styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        /* Simple style for the logout button in the nav */
        .nav-user a.logout {
            background-color: #ef4444;
            border-radius: 8px;
            padding: 8px 12px;
            color: white !important;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        .nav-user a.logout:hover {
            background-color: #dc2626;
        }
        /* Style for the container of the action buttons in the post footer */
        .post-footer-actions {
            display: flex;
            gap: 0.5rem;
        }
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
            <div class="nav-user">
                <div class="user-avatar">
                    <span class="avatar-initials"><?php echo htmlspecialchars($user['first_name'][0] . $user['last_name'][0]); ?></span>
                </div>
                <div class="user-info">
                    <span class="user-name"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></span>
                    <span class="user-department"><?php echo htmlspecialchars($user['department']); ?></span>
                </div>
                <a href="dashboard.php" style="color: white; text-decoration: none; font-weight: 500; margin-left: 1rem;">Dashboard</a>
                <a href="../PHP/logout.php" class="logout">Logout</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="dashboard-main">
        <div class="dashboard-container" style="max-width: 900px; margin-top: 2rem;">
            <!-- My Interested Projects Section -->
            <section class="browse-projects">
                <h2 class="section-title">My Interested Projects</h2>
                
                <?php if (mysqli_num_rows($posts_result) > 0): ?>
                    <?php while($post = mysqli_fetch_assoc($posts_result)): ?>
                        <div class="post-card">
                            <div class="post-card-header">
                                <h3 class="post-title"><?php echo htmlspecialchars($post['project_title']); ?></h3>
                                <span class="post-author">by <?php echo htmlspecialchars($post['first_name'] . ' ' . $post['last_name']); ?></span>
                            </div>
                            <p class="post-description"><?php echo nl2br(htmlspecialchars($post['project_description'])); ?></p>
                            <div class="post-skills">
                                <?php 
                                    $skills = explode(',', $post['required_skills']);
                                    foreach ($skills as $skill) {
                                        if (!empty(trim($skill))) {
                                            echo '<span class="skill-tag">' . htmlspecialchars(trim($skill)) . '</span>';
                                        }
                                    }
                                ?>
                            </div>
                            <div class="post-footer">
                                <span class="team-size">Looking for <strong><?php echo htmlspecialchars($post['team_size']); ?></strong> teammate(s)</span>
                                <div class="post-footer-actions">
                                    <a href="mailto:<?php echo htmlspecialchars($post['contact_email']); ?>" class="btn btn-sm btn-primary">Contact</a>
                                    <button class="btn btn-sm btn-secondary">Request</button>
                                </div>
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <p>You haven't shown interest in any projects yet. <a href="../index.php#featured" style="color: #6366f1;">Browse projects</a> to find one!</p>
                <?php endif; ?>

            </section>
        </div>
    </main>

</body>
</html>
