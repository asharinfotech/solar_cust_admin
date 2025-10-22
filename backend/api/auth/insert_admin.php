<?php
include_once('../../config/db.php'); // adjust path if needed

$email = 'admin@example.com';
$password = '9027267411';

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database
$stmt = $conn->prepare("INSERT INTO admins (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashedPassword);

if ($stmt->execute()) {
  echo "✅ Admin inserted successfully!";
} else {
  echo "❌ Error: " . $stmt->error;
}
