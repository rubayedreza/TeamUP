<?php
    session_start();
    include 'connection.php';

    // We need to get the data from the fetch request's body
    $data = json_decode(file_get_contents('php://input'), true);
    $post_id = $data['post_id'];
    
    // Default response
    $response = [
        'success' => false,
        'liked' => false
    ];

    // Ensure user is logged in
    if (isset($_SESSION['uid']) && isset($post_id)) {
        $user_id = $_SESSION['uid'];

        // Check if the user has already liked this post
        $check_sql = "SELECT id FROM interests WHERE user_id = ? AND post_id = ?";
        $check_stmt = mysqli_prepare($con, $check_sql);
        mysqli_stmt_bind_param($check_stmt, "ii", $user_id, $post_id);
        mysqli_stmt_execute($check_stmt);
        $result = mysqli_stmt_get_result($check_stmt);

        if (mysqli_num_rows($result) > 0) {
            // User has already liked it, so we UNLIKE it (delete the row)
            $delete_sql = "DELETE FROM interests WHERE user_id = ? AND post_id = ?";
            $delete_stmt = mysqli_prepare($con, $delete_sql);
            mysqli_stmt_bind_param($delete_stmt, "ii", $user_id, $post_id);
            if (mysqli_stmt_execute($delete_stmt)) {
                $response['success'] = true;
                $response['liked'] = false; // The post is now not liked
            }
        } else {
            // User has not liked it, so we LIKE it (insert a new row)
            $insert_sql = "INSERT INTO interests (user_id, post_id) VALUES (?, ?)";
            $insert_stmt = mysqli_prepare($con, $insert_sql);
            mysqli_stmt_bind_param($insert_stmt, "ii", $user_id, $post_id);
            if (mysqli_stmt_execute($insert_stmt)) {
                $response['success'] = true;
                $response['liked'] = true; // The post is now liked
            }
        }
    }

    // Send the response back to the JavaScript
    header('Content-Type: application/json');
    echo json_encode($response);
    mysqli_close($con);
?>
