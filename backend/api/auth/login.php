<?php
include_once('../../config/db.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Email and password required"]);
  exit();
}

$stmt = $conn->prepare("SELECT * FROM admins WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
  $token = bin2hex(random_bytes(16)); // simple session token
  echo json_encode(["success" => true, "token" => $token]);
} else {
  http_response_code(401);
  echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
