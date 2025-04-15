<?php
// Autoriser les requêtes cross-origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Simuler la récupération du score actuel
// Dans un cas réel, vous récupéreriez ces données depuis une base de données
// ou directement depuis le Raspberry Pi

// Récupérer le nom du joueur depuis la requête
$player = isset($_GET['player']) ? $_GET['player'] : 'UNKNOWN';

// Simuler un score (à remplacer par la vraie logique)
$score = rand(0, 999); // Score aléatoire pour la démonstration

// Retourner le score au format JSON
echo json_encode([
    "player" => $player,
    "score" => $score
]);
?>