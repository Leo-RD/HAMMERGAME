document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('play-button');
    const playerNameInput = document.getElementById('player-name');
    const loadingElement = document.getElementById('loading');
    const errorMessageElement = document.getElementById('error-message');
    
    // Animation du titre
    const title = document.querySelector('.title');
    setInterval(() => {
        title.style.textShadow = `0 0 ${Math.random() * 15 + 5}px rgba(255, 0, 0, 0.7)`;
    }, 500);
    
    // Gestionnaire d'événement pour le bouton Jouer
    playButton.addEventListener('click', async function() {
        const playerName = playerNameInput.value.trim();
        
        // Validation simple du pseudo
        if (!playerName) {
            alert('Veuillez entrer un pseudo');
            playerNameInput.focus();
            return;
        }
        
        // Afficher le chargement
        playButton.classList.add('hidden');
        loadingElement.classList.remove('hidden');
        errorMessageElement.classList.add('hidden');
        
        try {
            // Stocker le nom du joueur dans sessionStorage
            sessionStorage.setItem('playerName', playerName);
            
            // Rediriger vers la page du jeu
            window.location.href = 'game.html';
            
        } catch (error) {
            console.error('Erreur:', error);
            
            // Afficher le message d'erreur
            errorMessageElement.classList.remove('hidden');
            playButton.classList.remove('hidden');
            loadingElement.classList.add('hidden');
        }
    });
});