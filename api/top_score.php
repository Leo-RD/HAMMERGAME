<?php
// Inclure le fichier de connexion à la base de données
require_once 'db.php';

// Autoriser les requêtes cross-origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Préparer la requête SQL pour récupérer les 10 meilleurs scores
    $stmt = $conn->prepare("SELECT player_name as name, score FROM scores ORDER BY score DESC LIMIT 10");
    
    // Exécuter la requête
    $stmt->execute();
    
    // Récupérer les résultats
    $result = $stmt->get_result();
    
    // Créer un tableau pour stocker les scores
    $scores = [];
    
    // Parcourir les résultats
    while ($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
    
    // Retourner les scores au format JSON
    echo json_encode($scores);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => $e->getMessage()]);
}
?>

