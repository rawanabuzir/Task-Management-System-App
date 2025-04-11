<?php

include "connection/conn.php";


$data = json_decode(file_get_contents('php://input'), true);


if (isset($data['username']) && isset($data['email']) && isset($data['password'])) {
    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];

    if (!empty($username) && !empty($email) && !empty($password)) {
      
        $stmt = $con->prepare("INSERT INTO `users` (`username`, `email`, `password`) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $password]);

   
        if ($stmt->rowCount() > 0) {
          
            echo json_encode(['success' => true, 'message' => 'User registered successfully']);
        } else {
        
            echo json_encode(['success' => false, 'message' => 'User registration failed']);
        }
    } else {
     
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
    }
} else {
 
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}
?>
