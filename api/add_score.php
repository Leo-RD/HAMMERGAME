<?php
// Inclure le fichier de connexion à la base de données
require_once 'db.php';

// Autoriser les requêtes cross-origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Vérifier si la requête est une méthode POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données
    $player = isset($_POST['player']) ? $_POST['player'] : '';
    $score = isset($_POST['score']) ? intval($_POST['score']) : 0;
    
    // Validation simple
    if (empty($player) || $score <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "Données invalides"]);
        exit;
    }
    
    try {
        // Préparer la requête SQL pour insérer le score
        $stmt = $conn->prepare("INSERT INTO scores (player_name, score, created_at) VALUES (?, ?, NOW())");
        $stmt->bind_param("si", $player, $score);
        
        // Exécuter la requête
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Score ajouté avec succès"]);
        } else {
            throw new Exception("Erreur lors de l'ajout du score");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée"]);
}
?>