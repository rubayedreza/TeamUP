<?php
// Start the session to get the user's ID
session_start();

// Check if a session ID is set; if not, use a default for testing
// In a real application, you would redirect the user to a login page
$userId = isset($_SESSION['uid']) ? $_SESSION['uid'] : 'guest';

$message = ''; // A variable to store success or error messages

// --- PHP Upload Logic ---
// This code block runs only when the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['profilePhoto'])) {
    $file = $_FILES['profilePhoto'];

    // Define the directory where the image will be saved
    // This is a relative path from the current file's location
    $uploadDirectory = 'img/';

    // Get information about the file to check its type
    $fileInfo = pathinfo($file['name']);
    $fileExtension = strtolower($fileInfo['extension']);

    // Define allowed file extensions
    $allowedExtensions = ['jpg', 'jpeg', 'png'];

    // Check for a valid file type and upload errors
    if (!in_array($fileExtension, $allowedExtensions)) {
        $message = '<p style="color: red;">Error: Invalid file type. Only JPG, JPEG, and PNG are allowed.</p>';
    } elseif ($file['error'] !== UPLOAD_ERR_OK) {
        $message = '<p style="color: red;">Error: An upload error occurred.</p>';
    } else {
        // Construct the new filename using the user's ID and the original extension
        $newFilename = $userId . '.' . $fileExtension;
        $destinationPath = $uploadDirectory . $newFilename;

        // Use move_uploaded_file() to securely save the file
        if (move_uploaded_file($file['tmp_name'], $destinationPath)) {
            $message = '<p style="color: green;">Profile photo uploaded successfully!</p>';
        } else {
            $message = '<p style="color: red;">Error: Failed to save the image.</p>';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Profile Photo Uploader</title>
</head>
<body>

    <h1>Upload Your Profile Photo</h1>

    <!-- Display the message to the user -->
    <?php echo $message; ?>

    <!-- The form for uploading the photo -->
    <form action="upload_photo.php" method="post" enctype="multipart/form-data" id="photoUploadForm">
        <!-- The hidden file input that actually handles the file selection -->
        <!-- The 'name' attribute is crucial for the PHP script to find the file -->
        <input type="file" name="profilePhoto" id="profilePhotoInput" style="display: none;">

        <!-- The visible button that triggers the hidden input -->
        <button type="button" class="btn logout-btn addp" onclick="document.getElementById('profilePhotoInput').click();" id="addProfilePhotoBtn">Add Profile Photo</button>
    </form>

    <!-- JavaScript to automatically submit the form after a file is selected -->
    <script>
        document.getElementById('profilePhotoInput').addEventListener('change', function() {
            // This line automatically submits the form as soon as a file is chosen
            document.getElementById('photoUploadForm').submit();
        });
    </script>

</body>
</html>
