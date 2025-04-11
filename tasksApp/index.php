<?php
include "connection/conn.php";

try {
    $stem = $con->prepare("SELECT * FROM users");
    $stem->execute();

    $user = $stem->fetchAll(PDO::FETCH_ASSOC);
    $users = json_encode($user);


    header('Content-Type: application/json');
    echo $users;


} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
