<?php
include_once('../config/db.php');

// ✅ CORS setup
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ✅ Check DB connection
if (!$conn) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed"]);
  exit();
}

/* ------------------- GET ------------------- */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (isset($_GET['id'])) {
    // ✅ Get single project
    $id = intval($_GET['id']);
    $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row) {
      echo json_encode(["data" => $row]);
    } else {
      // React Admin prefers 200 with null instead of 404
      echo json_encode(["data" => null, "message" => "No item found for selected ID"]);
    }
    exit();
  }

  // ✅ Get all projects
  $result = $conn->query("SELECT * FROM projects");
  $items = [];
  while ($row = $result->fetch_assoc()) {
    $items[] = $row;
  }

  echo json_encode([
    "data" => $items,
    "total" => count($items) // ✅ Required by React Admin
  ]);
  exit();
}

/* ------------------- POST ------------------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);

  $stmt = $conn->prepare("INSERT INTO projects (id, title, description, location, capacity, year, image_url, type, src, thumbnail, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

  $stmt->bind_param(
    "ssssissssss",
    $data['id'],
    $data['title'],
    $data['description'],
    $data['location'],
    $data['capacity'],
    $data['year'],
    $data['image_url'],
    $data['type'],
    $data['src'],
    $data['thumbnail'],
    $data['category']
  );

  if ($stmt->execute()) {
    $newId = $conn->insert_id;
    echo json_encode(["data" => array_merge(["id" => $newId], $data)]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }
  exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $data = json_decode(file_get_contents("php://input"), true);

  if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input"]);
    exit();
  }

  if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing project ID"]);
    exit();
  }

  $fields = ['title', 'description', 'location', 'capacity', 'year', 'image_url', 'type', 'src', 'thumbnail', 'category'];
  $set = [];
  $params = [];
  $types = '';

  foreach ($fields as $field) {
    if (isset($data[$field])) {
      $set[] = "$field = ?";
      $params[] = $data[$field];
      $types .= ($field === 'capacity' || $field === 'id') ? 'i' : 's';
    }
  }

  if (empty($set)) {
    http_response_code(400);
    echo json_encode(["error" => "No fields to update"]);
    exit();
  }

  $params[] = $data['id'];
  $types .= 'i';

  $sql = "UPDATE projects SET " . implode(', ', $set) . " WHERE id = ?";
  $stmt = $conn->prepare($sql);

  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit();
  }

  $stmt->bind_param($types, ...$params);

  if ($stmt->execute()) {
    echo json_encode(["data" => $data, "message" => "Project updated successfully"]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }

  $stmt->close();
  exit();
}

/* ------------------- DELETE ------------------- */
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
  $id = intval($_GET['id']);
  $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {
    echo json_encode(["data" => ["id" => $id]]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }
  exit();
}

/* ------------------- Fallback ------------------- */
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
