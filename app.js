// JavaScript pour ajouter des fonctionnalités interactives
document.addEventListener('DOMContentLoaded', function() {
    // Animation du titre
    const title = document.querySelector('.title');
    setInterval(() => {
        title.style.textShadow = `0 0 ${Math.random() * 15 + 5}px rgba(255, 0, 0, 0.7)`;
    }, 500);
    
    // Vous pouvez ajouter ici d'autres fonctionnalités comme:
    // - Mise à jour dynamique des scores
    // - Gestion du classement
    // - Logique du jeu
    // - Effets sonores
    // - Animations supplémentaires
});