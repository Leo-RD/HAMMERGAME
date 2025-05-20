document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('play-button');
    const playerNameInput = document.getElementById('player-name');
    const loadingElement = document.getElementById('loading');
    const errorMessageElement = document.getElementById('error-message');

    if (!playerIdGlobal) {
    getOrCreatePlayer(playerName).then(id => {
        playerIdGlobal = id;
        console.log('🧠 ID joueur stocké :', id);
        sessionStorage.setItem('playerId', id);
    });
} else {
    console.log('🧠 ID joueur récupéré depuis sessionStorage :', playerIdGlobal);
}


    const API_URL = 'https://tom74.alwaysdata.net/hammerapi'; // à adapter selon ton hébergement

    // Animation du titre
    const title = document.querySelector('.title');
    let colors = ['#D00000', '#FFBA08', '#3F88C5', '#FFFFFF', '#32CD32'];
    let colorIndex = 0;

    function animateNeon() {
        colorIndex = (colorIndex + 1) % colors.length;
        title.style.color = colors[colorIndex];
        title.style.textShadow = `0 0 15px ${colors[colorIndex]}, 0 0 30px ${colors[colorIndex]}`;
    }
    setInterval(animateNeon, 300);
    title.classList.add('neon-effect');

    function createSparkle() {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
    setInterval(createSparkle, 500);

    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // ▶️ Clique sur "Jouer"
    playButton.addEventListener('click', async function () {
        const playerName = playerNameInput.value.trim();

        if (!playerName) {
            alert('Veuillez entrer un pseudo');
            playerNameInput.focus();
            return;
        }

        playButton.classList.add('hidden');
        loadingElement.classList.remove('hidden');
        errorMessageElement.classList.add('hidden');

        try {
            // 1. Création du joueur via l'API
            const createRes = await fetch(`${API_URL}/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: playerName, age: 0 }) // age requis par l'API
            });

            if (!createRes.ok) throw new Error('Échec de la création du joueur');

            // 2. Récupération de tous les joueurs pour retrouver son ID
            const playersRes = await fetch(`${API_URL}/players`);
            const players = await playersRes.json();
            const newPlayer = players.find(p => p.name === playerName);
            if (!newPlayer) throw new Error('Joueur introuvable après création');

            // 3. Stocker dans sessionStorage ou localStorage
            sessionStorage.setItem('playerId', newPlayer.id);
            sessionStorage.setItem('playerName', newPlayer.name);

            // 4. Rediriger vers le jeu
            window.location.href = 'game.html';

        } catch (error) {
            console.error('Erreur:', error);
            errorMessageElement.classList.remove('hidden');
            playButton.classList.remove('hidden');
            loadingElement.classList.add('hidden');
        }
    });
});
