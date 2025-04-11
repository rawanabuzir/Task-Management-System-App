<?php
include "connection/conn.php"; 


$data = json_decode(file_get_contents('php://input'), true);


if ($data === null) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$email = $data['email'];
$password = $data['password'];


$query = "SELECT * FROM users WHERE email = ? AND password = ?";
$stmt = $con->prepare($query);
$stmt->execute([$email, $password]);


$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
  
    echo json_encode(['success' => true, 'message' => 'Login successful', 'user' => $user]);
} else {
   
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
}
?>
