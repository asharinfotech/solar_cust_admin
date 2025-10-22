<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Allow-Origin: http://localhost:3000');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  http_response_code(200);
  exit();
}

// Main CORS headers for actual requests
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');

// Include DB connection
include_once '../config/db.php';

// Fetch users from database
$result = $conn->query("SELECT * FROM users");
$users = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    $users[] = $row;
  }
  echo json_encode($users);
} else {
  echo json_encode([
    "error" => "Failed to fetch users",
    "details" => $conn->error
  ]);
}
