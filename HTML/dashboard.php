<?php
    include '../PHP/connection.php';
    session_start();
    $uid = $_SESSION['uid'];
    if (!isset($uid)) {
        header("Location: ../HTML/login.html");
        exit();
    }

    $sql="SELECT * FROM register_info WHERE id='$uid'";
    $result = mysqli_query($con, $sql);
    if (mysqli_num_rows($result) == 0) {
        header("Location: ../HTML/register.html");
        exit();
    }
    $user = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - TeamUp DIU</title>
    <link rel="stylesheet" href="../CSS/dashboard.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation Header -->
    <nav class="dashboard-nav">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="../index.html" class="brand-logo">
                    <img src="../img/TeamUp.png" alt="TeamUp DIU Logo" class="logo-icon">
                    <span class="logo-text">TeamUp DIU</span>
                </a>
            </div>
            <div class="nav-user">
                <div class="user-avatar">
                    <span class="avatar-initials"><?php echo $user['first_name'][0] . $user['last_name'][0]; ?></span>
                </div>
                <div class="user-info">
                    <span class="user-name"><?php echo $user['first_name'] . ' ' . $user['last_name']; ?></span>
                    <span class="user-department"><?php echo $user['department']; ?></span>
                </div>
                <button class="profile-dropdown" id="profileDropdown">
                    <span class="dropdown-icon">▼</span>
                </button>
                <div class="dropdown-menu" id="dropdownMenu">
                    <a href="#" class="dropdown-item">My Profile</a>
                    <a href="#" class="dropdown-item">Settings</a>
                    <hr class="dropdown-divider">
                    <a href="../PHP/logout.php" class="dropdown-item logout">Logout</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Dashboard Content -->
    <main class="dashboard-main">
        <div class="dashboard-container">
            <!-- Welcome Section -->
            <section class="welcome-section">
                <div class="welcome-content">
                    <h1 class="welcome-title">Welcome back, <?php echo $user['first_name']; ?>!</h1>
                    <p class="welcome-subtitle">Ready to find your next teammate or project?</p>
                </div>
            </section>

            <!-- Quick Actions -->
            <section class="quick-actions">
                <h2 class="section-title">Quick Actions</h2>
                <div class="action-buttons">
                    <button class="action-btn primary" onclick="window.location.href='create_post.html'">
                        <div class="btn-icon">📝</div>
                        <div class="btn-content">
                            <span class="btn-title">Create Post</span>
                            <span class="btn-subtitle">Find teammates for your project</span>
                        </div>
                        <div class="btn-arrow">→</div>
                    </button>
                    
                    <button class="action-btn secondary" id="viewPostsBtn">
                        <div class="btn-icon">📋</div>
                        <div class="btn-content">
                            <span class="btn-title">My Posts</span>
                            <span class="btn-subtitle">Manage your project listings</span>
                        </div>
                        <div class="btn-arrow">→</div>
                    </button>
                    
                    <button class="action-btn tertiary" id="browseTeammatesBtn">
                        <div class="btn-icon">🔍</div>
                        <div class="btn-content">
                            <span class="btn-title">Browse Teammates</span>
                            <span class="btn-subtitle">Discover potential collaborators</span>
                        </div>
                        <div class="btn-arrow">→</div>
                    </button>
                </div>
            </section>
        </div>
    </main>
</body>
</html>
