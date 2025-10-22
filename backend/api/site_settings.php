<?php
include_once '../config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// ✅ Handle preflight
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

// ✅ GET: All or by section
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $conn->prepare("SELECT * FROM site_settings WHERE id = ?");
    if (!$stmt) {
      http_response_code(500);
      echo json_encode(["error" => $conn->error]);
      exit();
    }
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if ($row) {
      echo json_encode($row); // ✅ includes 'id'
    } else {
      http_response_code(404);
      echo json_encode(["error" => "ID not found"]);
    }
    exit();
  }


  $result = $conn->query("SELECT * FROM site_settings");
  $items = [];
  while ($row = $result->fetch_assoc()) {
    $items[] = $row;
  }
  echo json_encode($items);
  exit();
}

// ✅ POST: Add new section
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  if (!isset($data['key_name']) || !isset($data['value'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing section or content"]);
    exit();
  }

  $stmt = $conn->prepare("INSERT INTO site_settings (key_name, value) VALUES (?, ?)");
  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit();
  }

  $stmt->bind_param("ss", $data['key_name'], $data['value']);
  if ($stmt->execute()) {
    $newId = $conn->insert_id;
    echo json_encode(["data" => [
      "id" => $newId,
      "key_name" => $data['key_name'],
      "value" => $data['value']
    ]]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }
  exit();
}

// ✅ PUT: Update by ID
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $data = json_decode(file_get_contents("php://input"), true);
  if (!isset($data['id']) || !isset($data['value'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing id or value"]);
    exit();
  }

  $stmt = $conn->prepare("UPDATE site_settings SET value = ? WHERE id = ?");
  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit();
  }

  $stmt->bind_param("si", $data['value'], $data['id']);
  if ($stmt->execute()) {
    if ($stmt->affected_rows === 0) {
      http_response_code(404);
      echo json_encode(["error" => "ID not found"]);
    } else {
      echo json_encode(["data" => [
        "id" => $data['id'],           // ✅ Required by React Admin
        "key_name" => $data['key_name'], // Optional but helpful
        "value" => $data['value']
      ]]);
    }
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }
  exit();
}

// ✅ DELETE: Remove by ID
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
  $id = intval($_GET['id']);
  $stmt = $conn->prepare("DELETE FROM site_settings WHERE id = ?");
  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit();
  }

  $stmt->bind_param("i", $id);
  if ($stmt->execute()) {
    if ($stmt->affected_rows === 0) {
      http_response_code(404);
      echo json_encode(["error" => "ID not found"]);
    } else {
      echo json_encode(["data" => ["id" => $id]]);
    }
  } else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
  }
  exit();
}

// ✅ Fallback
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
