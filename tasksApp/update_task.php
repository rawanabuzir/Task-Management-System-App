<?php

include "connection/conn.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);


if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Error decoding JSON data: ' . json_last_error_msg()]);
    exit();
}


if (!isset($data['t_id']) || !isset($data['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields: t_id and user_id']);
    exit();
}

$task_id = $data['t_id'];
$user_id = $data['user_id'];


$set_clauses = [];
$params = [];

if (isset($data['t_title'])) {
    $set_clauses[] = "t_title = ?";
    $params[] = $data['t_title'];
}

if (isset($data['t_containt'])) {
    $set_clauses[] = "t_containt = ?";
    $params[] = $data['t_containt'];
}


if (isset($data['is_active']) && (is_numeric($data['is_active']) && ($data['is_active'] === 0 || $data['is_active'] === 1))) {
    $set_clauses[] = "is_active = ?";
    $params[] = $data['is_active'];
} else if (isset($data['is_active'])) {


}


if (empty($set_clauses)) {
    echo json_encode(['success' => false, 'message' => 'No valid fields to update']);
    exit();
}

$sql = "UPDATE tasks SET " . implode(', ', $set_clauses) . " WHERE t_id = ? AND user_id = ?";
$params[] = $task_id;
$params[] = $user_id;

$stmt = $con->prepare($sql);

if ($stmt) {
    if ($stmt->execute($params)) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Task not found or unauthorized']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error executing SQL statement: ' . implode(" - ", $stmt->errorInfo())]);
    }
    $stmt->closeCursor();
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error preparing SQL statement']);
}


$con = null;
?>