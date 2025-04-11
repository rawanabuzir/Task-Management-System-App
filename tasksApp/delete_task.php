<?php
include "connection/conn.php"; 


if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['t_id']) && isset($_GET['user_id'])) {
    $task_id = $_GET['t_id'];
    $user_id = $_GET['user_id'];


    $query = "DELETE FROM tasks WHERE t_id = ? AND user_id = ?";
    $stmt = $con->prepare($query);

    if ($stmt->execute([$task_id, $user_id])) {
    
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
        } else {
      
            echo json_encode(['success' => false, 'message' => 'Task not found or unauthorized']);
        }
    } else {
       
        echo json_encode(['success' => false, 'message' => 'Failed to delete task']);
    }
} else {
  
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}


$con = null;
?>