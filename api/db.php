<?php
// Paramètres de connexion à la base de données
$host = "mysql-votre-domaine.alwaysdata.net"; // À remplacer par votre hôte
$username = "votre_utilisateur"; // À remplacer par votre nom d'utilisateur
$password = "votre_mot_de_passe"; // À remplacer par votre mot de passe
$database = "votre_base_de_donnees"; // À remplacer par votre base de données

// Créer la connexion
$conn = new mysqli($host, $username, $password, $database);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connexion échouée: " . $conn->connect_error);
}

// Définir le jeu de caractères
$conn->set_charset("utf8");
?>