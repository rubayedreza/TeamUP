<?php
    include '../PHP/connection.php';
    session_start();
    
    if (!isset($_SESSION['uid'])) {
        header("Location: ../HTML/login.html");
        exit();
    }
    $uid = $_SESSION['uid'];

    // Use prepared statements to prevent SQL injection
    $user_sql = "SELECT * FROM register_info WHERE id = ?";
    $stmt = mysqli_prepare($con, $user_sql);
    mysqli_stmt_bind_param($stmt, "i", $uid);
    mysqli_stmt_execute($stmt);
    $user_result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($user_result) == 0) {
        header("Location: ../HTML/register.html");
        exit();
    }
    $user = mysqli_fetch_assoc($user_result);

    // Fetch all posts from the database, joining with user info
    $posts_sql = "SELECT posts.*, register_info.first_name, register_info.last_name 
                  FROM posts 
                  JOIN register_info ON posts.user_id = register_info.id 
                  ORDER BY posts.created_at DESC";
    $posts_result = mysqli_query($con, $posts_sql);
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
                    <span class="avatar-initials"><?php echo htmlspecialchars($user['first_name'][0] . $user['last_name'][0]); ?></span>
                </div>
                <div class="user-info">
                    <span class="user-name"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></span>
                    <span class="user-department"><?php echo htmlspecialchars($user['department']); ?></span>
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

    <!-- Profile Section -->
    <section class="profile-section">
        <div class="profile-container row-layout">
            <div class="profile-photo-wrapper">
                <img src="../img/TeamUp.jpg" alt="Profile Photo" class="profile-photo" id="profilePhoto">
                <input type="file" id="profilePhotoInput" accept="image/*" style="display:none;">
            </div>
            <div class="profile-info">
                <h2 class="profile-name"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></h2>
                <p class="profile-department"><?php echo htmlspecialchars($user['department']); ?></p>
                <p class="profile-email"><?php echo htmlspecialchars($user['email']); ?></p>
                <p class="profile-semester"><?php echo htmlspecialchars($user['semester']); ?> Semester</p>
                <p class="profile-id">Student ID: <?php echo htmlspecialchars($user['student_id']); ?></p>
                <button class="btn btn-danger logout-btn" onclick="window.location.href='../PHP/logout.php'" id="logoutBtn">Logout</button>
            </div>
        </div>
    </section>

    <!-- Main Dashboard Content -->
    <main class="dashboard-main">
        <div class="dashboard-container">
            <!-- Welcome Section -->
            <section class="welcome-section">
                <div class="welcome-content">
                    <h1 class="welcome-title">Welcome back, <?php echo htmlspecialchars($user['first_name']); ?>!</h1>
                    <p class="welcome-subtitle">Ready to find your next teammate or project?</p>
                </div>
                <div class="stats-cards">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <span class="stat-number"><?php echo $user['active_projects'] ?? 0; ?></span>
                            <span class="stat-label">Active Projects</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🤝</div>
                        <div class="stat-info">
                            <span class="stat-number"><?php echo $user['team_requests'] ?? 0; ?></span>
                            <span class="stat-label">Team Requests</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-info">
                            <span class="stat-number"><?php echo $user['rating'] ?? 'N/A'; ?></span>
                            <span class="stat-label">Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Quick Actions -->
            <section class="quick-actions">
                <h2 class="section-title">Quick Actions</h2>
                <div class="action-buttons">
                    <button class="action-btn primary" onclick="window.location.href='create_post.php'">
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

            <!-- Browse Projects Section -->
            <section class="browse-projects">
                <h2 class="section-title">Browse Projects</h2>
                
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
                                <a href="mailto:<?php echo htmlspecialchars($post['contact_email']); ?>" class="btn btn-sm btn-primary">Contact</a>
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <p>No projects have been posted yet. Be the first to create one!</p>
                <?php endif; ?>

            </section>

            <!-- Recent Activity & Requests -->
            <div class="dashboard-grid">
                <!-- Recent Requests -->
                <section class="recent-requests">
                    <div class="section-header">
                        <h2 class="section-title">Recent Requests</h2>
                        <a href="#" class="view-all">View All</a>
                    </div>
                    
                    <div class="requests-list">
                        <div class="request-card">
                            <div class="request-avatar">
                                <span class="avatar-initials">SC</span>
                                <div class="status-indicator online"></div>
                            </div>
                            <div class="request-content">
                                <div class="request-header">
                                    <h3 class="requester-name">Sarah Connor</h3>
                                    <span class="request-time">2 hours ago</span>
                                </div>
                                <p class="project-title"><strong>Project:</strong> Robotics Competition</p>
                                <div class="skills-needed">
                                    <span class="skills-label">Skills Needed:</span>
                                    <div class="skill-tags">
                                        <span class="skill-tag">C++</span>
                                        <span class="skill-tag">Arduino</span>
                                        <span class="skill-tag">Hardware</span>
                                    </div>
                                </div>
                                <div class="request-actions">
                                    <button class="btn btn-sm btn-primary">Accept</button>
                                    <button class="btn btn-sm btn-secondary">View Details</button>
                                </div>
                            </div>
                        </div>

                        <div class="request-card">
                            <div class="request-avatar">
                                <span class="avatar-initials">MJ</span>
                                <div class="status-indicator away"></div>
                            </div>
                            <div class="request-content">
                                <div class="request-header">
                                    <h3 class="requester-name">Mike Johnson</h3>
                                    <span class="request-time">5 hours ago</span>
                                </div>
                                <p class="project-title"><strong>Project:</strong> Web Development Portfolio</p>
                                <div class="skills-needed">
                                    <span class="skills-label">Skills Needed:</span>
                                    <div class="skill-tags">
                                        <span class="skill-tag">React</span>
                                        <span class="skill-tag">Node.js</span>
                                        <span class="skill-tag">UI/UX</span>
                                    </div>
                                </div>
                                <div class="request-actions">
                                    <button class="btn btn-sm btn-primary">Accept</button>
                                    <button class="btn btn-sm btn-secondary">View Details</button>
                                </div>
                            </div>
                        </div>

                        <div class="request-card">
                            <div class="request-avatar">
                                <span class="avatar-initials">AL</span>
                                <div class="status-indicator offline"></div>
                            </div>
                            <div class="request-content">
                                <div class="request-header">
                                    <h3 class="requester-name">Anna Lee</h3>
                                    <span class="request-time">1 day ago</span>
                                </div>
                                <p class="project-title"><strong>Project:</strong> Mobile App Development</p>
                                <div class="skills-needed">
                                    <span class="skills-label">Skills Needed:</span>
                                    <div class="skill-tags">
                                        <span class="skill-tag">Flutter</span>
                                        <span class="skill-tag">Firebase</span>
                                        <span class="skill-tag">Design</span>
                                    </div>
                                </div>
                                <div class="request-actions">
                                    <button class="btn btn-sm btn-primary">Accept</button>
                                    <button class="btn btn-sm btn-secondary">View Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Recent Activity -->
                <section class="recent-activity">
                    <div class="section-header">
                        <h2 class="section-title">Recent Activity</h2>
                        <a href="#" class="view-all">View All</a>
                    </div>
                    
                    <div class="activity-feed">
                        <div class="activity-item">
                            <div class="activity-icon">👤</div>
                            <div class="activity-content">
                                <p class="activity-text">
                                    <strong>David Wilson</strong> joined your project 
                                    <em>"AI Chatbot Development"</em>
                                </p>
                                <span class="activity-time">3 hours ago</span>
                            </div>
                        </div>

                        <div class="activity-item">
                            <div class="activity-icon">💬</div>
                            <div class="activity-content">
                                <p class="activity-text">
                                    New message from <strong>Emma Davis</strong> about 
                                    <em>"Database Design Project"</em>
                                </p>
                                <span class="activity-time">6 hours ago</span>
                            </div>
                        </div>

                        <div class="activity-item">
                            <div class="activity-icon">📝</div>
                            <div class="activity-content">
                                <p class="activity-text">
                                    You posted a new project: 
                                    <em>"Machine Learning Research"</em>
                                </p>
                                <span class="activity-time">2 days ago</span>
                            </div>
                        </div>

                        <div class="activity-item">
                            <div class="activity-icon">⭐</div>
                            <div class="activity-content">
                                <p class="activity-text">
                                    <strong>Lisa Zhang</strong> rated your collaboration 
                                    <em>5 stars</em> for "E-commerce Website"
                                </p>
                                <span class="activity-time">3 days ago</span>
                            </div>
                        </div>

                        <div class="activity-item">
                            <div class="activity-icon">🎯</div>
                            <div class="activity-content">
                                <p class="activity-text">
                                    Project <em>"Mobile Game Development"</em> was 
                                    successfully completed
                                </p>
                                <span class="activity-time">1 week ago</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Recommended Teammates -->
            <section class="recommended-teammates">
                <div class="section-header">
                    <h2 class="section-title">Recommended Teammates</h2>
                    <a href="#" class="view-all">Browse All</a>
                </div>
                
                <div class="teammates-grid">
                    <div class="teammate-card">
                        <div class="teammate-avatar">
                            <span class="avatar-initials">RK</span>
                            <div class="status-indicator online"></div>
                        </div>
                        <div class="teammate-info">
                            <h3 class="teammate-name">Rachel Kim</h3>
                            <p class="teammate-department">Software Engineering</p>
                            <p class="teammate-semester">6th Semester</p>
                            <div class="teammate-skills">
                                <span class="skill-tag">Python</span>
                                <span class="skill-tag">Django</span>
                                <span class="skill-tag">PostgreSQL</span>
                            </div>
                            <div class="teammate-rating">
                                <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                                <span class="rating-text">4.9 (23 reviews)</span>
                            </div>
                        </div>
                        <div class="teammate-actions">
                            <button class="btn btn-sm btn-primary">Connect</button>
                            <button class="btn btn-sm btn-secondary">View Profile</button>
                        </div>
                    </div>

                    <div class="teammate-card">
                        <div class="teammate-avatar">
                            <span class="avatar-initials">TM</span>
                            <div class="status-indicator away"></div>
                        </div>
                        <div class="teammate-info">
                            <h3 class="teammate-name">Tom Mitchell</h3>
                            <p class="teammate-department">Computer Engineering</p>
                            <p class="teammate-semester">7th Semester</p>
                            <div class="teammate-skills">
                                <span class="skill-tag">Java</span>
                                <span class="skill-tag">Spring Boot</span>
                                <span class="skill-tag">AWS</span>
                            </div>
                            <div class="teammate-rating">
                                <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                                <span class="rating-text">4.7 (18 reviews)</span>
                            </div>
                        </div>
                        <div class="teammate-actions">
                            <button class="btn btn-sm btn-primary">Connect</button>
                            <button class="btn btn-sm btn-secondary">View Profile</button>
                        </div>
                    </div>

                    <div class="teammate-card">
                        <div class="teammate-avatar">
                            <span class="avatar-initials">SP</span>
                            <div class="status-indicator online"></div>
                        </div>
                        <div class="teammate-info">
                            <h3 class="teammate-name">Sophia Park</h3>
                            <p class="teammate-department">Computer Science & Engineering</p>
                            <p class="teammate-semester">8th Semester</p>
                            <div class="teammate-skills">
                                <span class="skill-tag">React</span>
                                <span class="skill-tag">TypeScript</span>
                                <span class="skill-tag">GraphQL</span>
                            </div>
                            <div class="teammate-rating">
                                <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                                <span class="rating-text">5.0 (31 reviews)</span>
                            </div>
                        </div>
                        <div class="teammate-actions">
                            <button class="btn btn-sm btn-primary">Connect</button>
                            <button class="btn btn-sm btn-secondary">View Profile</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Floating Action Button -->
    <button class="fab" id="fabBtn" title="Quick Actions">
        <span class="fab-icon">+</span>
    </button>

    <!-- Quick Action Menu -->
    <div class="fab-menu" id="fabMenu">
        <button class="fab-option" data-action="create-post">
            <span class="fab-option-icon">📝</span>
            <span class="fab-option-text">Create Post</span>
        </button>
        <button class="fab-option" data-action="browse-teammates">
            <span class="fab-option-icon">🔍</span>
            <span class="fab-option-text">Browse</span>
        </button>
        <button class="fab-option" data-action="messages">
            <span class="fab-option-icon">💬</span>
            <span class="fab-option-text">Messages</span>
        </button>
    </div>

</body>
</html>
