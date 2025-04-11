<?php
include "connection/conn.php"; 


$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {

    echo json_encode(['success' => false, 'message' => 'Error decoding JSON data']);
    exit();
}


if (isset($data['user_id']) && isset($data['t_title']) && isset($data['t_content'])) {
    $user_id = $data['user_id'];
    $t_title = $data['t_title'];
    $t_containt = $data['t_content']; 

    
    $query = "INSERT INTO tasks (t_title, t_containt, user_id) VALUES (?, ?, ?)";
    $stmt = $con->prepare($query);

    if ($stmt->execute([$t_title, $t_containt, $user_id])) {
        echo json_encode(['success' => true, 'message' => 'Task added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add task']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}
?>