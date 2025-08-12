<?php
    include '../PHP/connection.php';
    session_start();
    
    if (!isset($_SESSION['uid'])) {
        header("Location: ../HTML/login.html");
        exit();
    }
    $uid = $_SESSION['uid'];

    // Fetch user data
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

    $chat_sql = "SELECT * FROM chat_messages ORDER BY timestamp DESC";
    $chat_result = mysqli_query($con, $chat_sql);
    $chat_messages = mysqli_fetch_all($chat_result, MYSQLI_ASSOC);

    $profilePhotoPath = "../img/" . $uid . "pp.png";

    // Check if the file exists on the server
    if (file_exists($profilePhotoPath)) {
        $src = $profilePhotoPath;
    } else {
        $src = "../img/TeamUp.jpg";
    }


function time_ago($timestamp) {
    $current_time = time();
    $message_time = strtotime($timestamp);
    $time_difference = $current_time - $message_time;

    if ($time_difference < 0) {
        return "In the future";
    }

    $seconds = $time_difference;
    $minutes = round($seconds / 60);
    $hours = round($seconds / 3600);
    $days = round($seconds / 86400);

    if ($seconds < 60) {
        return "Just now";
    } elseif ($minutes < 60) {
        return $minutes == 1 ? "1 minute ago" : "$minutes minutes ago";
    } elseif ($hours < 24) {
        return $hours == 1 ? "1 hour ago" : "$hours hours ago";
    } elseif ($days < 7) {
        return $days == 1 ? "1 day ago" : "$days days ago";
    } else {
        return date('M j, Y', $message_time);
    }
}


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
                <a href="../index.php" class="brand-logo">
                    <img src="../img/TeamUp.png" alt="TeamUp DIU Logo" class="logo-icon">
                    <span class="logo-text">TeamUp DIU</span>
                </a>
            </div>
            <div class="nav-user">
                <div class="user-avatar">
                    <img src="<?php echo htmlspecialchars($src); ?>" alt="Profile Photo" class="profile-photo-s" id="profilePhoto"></span>
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
                <img src="<?php echo htmlspecialchars($src); ?>" alt="Profile Photo" class="profile-photo" id="profilePhoto">
                <input type="file" id="profilePhotoInput" accept="image/*" style="display:none;">
            </div>
            <div class="profile-info">
                <h2 class="profile-name"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></h2>
                <p class="profile-department"><?php echo htmlspecialchars($user['department']); ?></p>
                <p class="profile-email"><?php echo htmlspecialchars($user['email']); ?></p>
                <p class="profile-semester"><?php echo htmlspecialchars($user['semester']); ?> Semester</p>
                <p class="profile-id">Student ID: <?php echo htmlspecialchars($user['student_id']); ?></p>
                <div class="buttondiv">
                    
                <div class="bt">
                    <form action="../PHP/upload.php"  method="post" enctype="multipart/form-data">
                    <input type="file" name="image" class="hidden-input" id="imageInput" accept="image/*">
                    <button type="submit" class="btn logout-btn profile-btn">Upload photo</button>
                </form>
                <button class="btn btn-danger logout-btn" onclick="window.location.href='../PHP/logout.php'" id="logoutBtn">Logout</button>
                </div>
                
                </div>


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
                    
                    <button class="action-btn secondary" onclick="window.location.href='my_interests.php'">
                        <div class="btn-icon">❤️</div>
                        <div class="btn-content">
                            <span class="btn-title">My Interests</span>
                            <span class="btn-subtitle">View posts you're interested in</span>
                        </div>
                        <div class="btn-arrow">→</div>
                    </button>
                    
                    <button class="action-btn tertiary" onclick="window.location.href='../index.php#featured'">
                        <div class="btn-icon">🔍</div>
                        <div class="btn-content">
                            <span class="btn-title">Browse All Projects</span>
                            <span class="btn-subtitle">Discover new opportunities</span>
                        </div>
                        <div class="btn-arrow">→</div>
                    </button>
                </div>
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
                                <span class="avatar-initials">RR</span>
                                <div class="status-indicator online"></div>
                            </div>
                            <div class="request-content">
                                <div class="request-header">
                                    <h3 class="requester-name">Rubayed Reza</h3>
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
                                <span class="avatar-initials">SR</span>
                                <div class="status-indicator away"></div>
                            </div>
                            <div class="request-content">
                                <div class="request-header">
                                    <h3 class="requester-name">Sumaiya Ritu</h3>
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
                                <span class="avatar-initials">PS</span>
                                <div class="status-indicator offline"></div>
                            </div>
                            <div class="request-content">
                                <div class="request-header">
                                    <h3 class="requester-name">Pritom Saha</h3>
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

                <!-- Chat -->
                <section class="recent-activity" id="chat">
                    <div class="section-header">
                        <h2 class="section-title">Chats</h2>
                        <form action="../PHP/chat.php" class="chat-form" method="POST">
                            <input type="text" placeholder="send message..." class="chat-input" name="message">
                            <button type="submit" class="btn btn-primary">Send</button>
                            <button type="reset" class="btn btn-secondary" id="clearSearchBtn">Clear</button>
                        </form>
                    </div>
                    
                    <div class="activity-feed">
                        <?php foreach ($chat_messages as $message): ?>
                        <div class="activity-item">
                            <div class="activity-icon">👤</div>
                            <div class="activity-content">
                                <p class="activity-text">
                                    <strong><?php echo htmlspecialchars($message['name']); ?></strong><br>
                                    <em><?php echo htmlspecialchars($message['message']); ?></em>
                                </p>
                                <span class="activity-time" data-timestamp="<?php echo htmlspecialchars($message['timestamp']); ?>">
                                    <?php echo time_ago($message['timestamp']); ?>
                                </span>
                            </div>
                        </div>
                        <?php endforeach; ?>
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
                            <span class="avatar-initials">PS</span>
                            <div class="status-indicator online"></div>
                        </div>
                        <div class="teammate-info">
                            <h3 class="teammate-name">Pritom Saha</h3>
                            <p class="teammate-department">Computer Science & Engineering</p>
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
                            <span class="avatar-initials">RR</span>
                            <div class="status-indicator away"></div>
                        </div>
                        <div class="teammate-info">
                            <h3 class="teammate-name">Rubayed Reza</h3>
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
                            <span class="avatar-initials">SR</span>
                            <div class="status-indicator online"></div>
                        </div>
                        <div class="teammate-info">
                            <h3 class="teammate-name">Sumaiya Ritu</h3>
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
<script>
    // This function calculates the "time ago" value in the browser
    function updateTimestampText(timestampElement) {
        const rawTimestamp = timestampElement.getAttribute('data-timestamp');
        const messageTime = new Date(rawTimestamp);
        const now = new Date();
        const seconds = Math.floor((now - messageTime) / 1000);

        let result = '';
        if (seconds < 60) {
            result = "Just now";
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            result = minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            result = hours === 1 ? "1 hour ago" : `${hours} hours ago`;
        } else if (seconds < 604800) {
            const days = Math.floor(seconds / 86400);
            result = days === 1 ? "1 day ago" : `${days} days ago`;
        } else {
            // For older messages, show the full date
            result = messageTime.toLocaleDateString();
        }

        timestampElement.textContent = result;
    }

    // This function finds all timestamp elements and updates them
    function refreshTimestamps() {
        document.querySelectorAll('.activity-time').forEach(element => {
            updateTimestampText(element);
        });
    }

    // Run the update function once when the page loads
    refreshTimestamps();

    // Set an interval to run the update every minute (60000 milliseconds)
    setInterval(refreshTimestamps, 60000);
</script>
</body>
</html>
