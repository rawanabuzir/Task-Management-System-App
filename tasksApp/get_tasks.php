<?php
include "connection/conn.php"; 


if (isset($_GET['user_id']) && !empty($_GET['user_id'])) {
    $user_id = $_GET['user_id'];
    
    $query = "SELECT t_id, t_title, t_containt, user_id FROM tasks WHERE user_id = ?";
    $stmt = $con->prepare($query);


    if ($stmt->execute([$user_id])) {
   
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    
        if ($tasks) {
    
            foreach ($tasks as &$task) {
                $task['user_id'] = $user_id;
            }

            /
            header('Content-Type: application/json; charset=utf-8');
         
            echo json_encode(['success' => true, 'tasks' => $tasks], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(['success' => false, 'message' => 'No tasks found for this user.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error executing the query.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User ID not provided or invalid.']);
}
?>
