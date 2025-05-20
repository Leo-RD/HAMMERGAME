document.addEventListener('DOMContentLoaded', function () {
    const playButton = document.getElementById('play-button');
    const playerNameInput = document.getElementById('player-name');
    const loadingElement = document.getElementById('loading');
    const errorMessageElement = document.getElementById('error-message');

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
            // 1. Vérifier si le joueur existe déjà
            const getRes = await fetch(`${API_URL}/players?name=${encodeURIComponent(playerName)}`);
            let playerData = await getRes.json();

            let playerId = null;

            if (Array.isArray(playerData) && playerData.length > 0) {
                // Joueur trouvé
                playerId = playerData[0].id;
                console.log('👤 Joueur existant trouvé, ID :', playerId);
            } else {
                // Joueur non trouvé, on le crée
                console.log('➕ Joueur non trouvé, création...');
                const createRes = await fetch(`${API_URL}/players`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: playerName, age: 0 }) // age requis par l'API
                });

                if (!createRes.ok) throw new Error('Erreur lors de la création du joueur');

                const allPlayersRes = await fetch(`${API_URL}/players`);
                const allPlayers = await allPlayersRes.json();
                const newPlayer = allPlayers.find(p => p.name === playerName);
                if (!newPlayer) throw new Error('Impossible de retrouver le joueur après création');

                playerId = newPlayer.id;
                console.log('✅ Joueur créé, ID :', playerId);
            }

            // 2. Stocker dans sessionStorage
            sessionStorage.setItem('playerId', playerId);
            sessionStorage.setItem('playerName', playerName);

            // 3. Rediriger vers le jeu
            window.location.href = 'game.html';

        } catch (error) {
            console.error('❌ Erreur dans app.js :', error);
            errorMessageElement.classList.remove('hidden');
            playButton.classList.remove('hidden');
            loadingElement.classList.add('hidden');
        }
    });
});
