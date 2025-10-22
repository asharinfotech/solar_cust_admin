<?php
include_once '../config/db.php';

// ✅ CORS setup
$allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
  header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// ✅ Handle preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ✅ Check DB connection
if (!$conn) {
  http_response_code(500);
  echo json_encode(["success" => false, "error" => "Database connection failed"]);
  exit();
}

// ✅ POST: Insert new user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = file_get_contents("php://input");
  $data = json_decode($input, true);

  if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid or empty JSON data"]);
    exit();
  }

  $stmt = $conn->prepare("INSERT INTO solar_users 
    (country, state, name, phone, city, pincode, solarFor, monthlyBill, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit();
  }

  $stmt->bind_param(
    "ssssssss",
    $data['country'],
    $data['state'],
    $data['name'],
    $data['phone'],
    $data['city'],
    $data['pincode'],
    $data['solarFor'],
    $data['monthlyBill']
  );

  if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Data inserted successfully"]);
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $stmt->error]);
  }
  exit();
}

// ✅ PUT: Update existing user
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $input = file_get_contents("php://input");
  file_put_contents("debug.txt", $input); // ✅ log raw input

  $data = json_decode($input, true);

  if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user ID"]);
    exit();
  }

  $stmt = $conn->prepare("UPDATE solar_users SET 
    country = ?, state = ?, name = ?, phone = ?, city = ?, pincode = ?, solarFor = ?, monthlyBill = ?
    WHERE id = ?");

  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit();
  }

  $stmt->bind_param(
    "ssssssssi",
    $data['country'],
    $data['state'],
    $data['name'],
    $data['phone'],
    $data['city'],
    $data['pincode'],
    $data['solarFor'],
    $data['monthlyBill'],
    $data['id']
  );

  if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User updated", "id" => $data['id']]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }
  exit();
}

// ✅ DELETE: Remove user by ID
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
  $id = intval($_GET['id']);
  $stmt = $conn->prepare("DELETE FROM solar_users WHERE id = ?");
  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User deleted", "id" => $id]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }
  exit();
}

// ✅ GET with ?id=... : Fetch single user
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
  $id = intval($_GET['id']);
  $stmt = $conn->prepare("SELECT * FROM solar_users WHERE id = ?");
  $stmt->bind_param("i", $id);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($row = $result->fetch_assoc()) {
    if (isset($row['date'])) {
      $row['date'] = date('d M Y', strtotime($row['date']));
    }
    echo json_encode($row);
  } else {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
  }
  exit();
}

// ✅ GET: Fetch all users
$result = $conn->query("SELECT * FROM solar_users");
$users = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    if (isset($row['date'])) {
      $row['date'] = date('d M Y', strtotime($row['date']));
    }
    $users[] = $row;
  }
  echo json_encode($users);
} else {
  http_response_code(500);
  echo json_encode(["success" => false, "error" => $conn->error]);
}
