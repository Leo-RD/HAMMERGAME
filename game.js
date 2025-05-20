document.addEventListener('DOMContentLoaded', function () {
    const playerName = sessionStorage.getItem('playerName') || 'JOUEUR';

    let playerIdGlobal = null;

    // Récupère ou crée le joueur au chargement
    getOrCreatePlayer(playerName).then(id => {
        playerIdGlobal = id;
    });

    // Animation du titre
    const title = document.querySelector('.title');
    let colors = ['#D00000', '#FFBA08', '#3F88C5', '#FFFFFF', '#32CD32'];
    let colorIndex = 0;
    setInterval(() => {
        colorIndex = (colorIndex + 1) % colors.length;
        title.style.color = colors[colorIndex];
        title.style.textShadow = `0 0 15px ${colors[colorIndex]}, 0 0 30px ${colors[colorIndex]}`;
    }, 300);
    title.classList.add('neon-effect');

    // Étincelles
    function createSparkle() {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
    setInterval(createSparkle, 500);

    // Bouton retour
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Chargement des scores initiaux
    loadTopScores();

    document.getElementById('refresh-button').addEventListener('click', function () {
        loadTopScores();
    });

    // Connexion Pusher
    setupPusher();
});

// 🔄 Crée ou récupère un joueur existant
async function getOrCreatePlayer(name) {
    try {
        const checkResponse = await fetch(`https://tom74.alwaysdata.net/hammerapi/players?name=${encodeURIComponent(name)}`);
        if (checkResponse.ok) {
            const existingPlayer = await checkResponse.json();

            // Vérifie si c’est un tableau avec au moins un joueur
            if (Array.isArray(existingPlayer) && existingPlayer.length > 0 && existingPlayer[0].id) {
                console.log("👤 Joueur existant trouvé:", existingPlayer[0]);
                return existingPlayer[0].id;
            } else if (existingPlayer.id) {
                // Cas unique d’un objet
                console.log("👤 Joueur existant trouvé (objet):", existingPlayer);
                return existingPlayer.id;
            }
        }

        // Sinon le crée
        const response = await fetch('https://tom74.alwaysdata.net/hammerapi/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, age: 0 })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error("Erreur création joueur: " + err);
        }

        const newPlayer = await response.json();
        console.log('✅ Joueur créé :', newPlayer);
        return newPlayer.id;
    } catch (error) {
        console.error('Erreur lors de getOrCreatePlayer:', error);
        return null;
    }
}

// 📤 Envoie le score à l'API
async function sendScoreToAPI(playerId, score, hitStrength) {
    try {
        console.log("Données envoyées à l'API :", {
            player_id: playerId,
            score: score,
            hit_strength: hitStrength
        });

        const response = await fetch('https://tom74.alwaysdata.net/hammerapi/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player_id: playerId,
                score: score,
                hit_strength: hitStrength
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Erreur lors de l\'envoi du score');
        }

        console.log("✅ Score envoyé avec succès:", result.message);
    } catch (error) {
        console.error("❌ Erreur envoi score:", error);
    }
}

// 🧾 Affiche les meilleurs scores
async function loadTopScores() {
    try {
        const response = await fetch(`https://tom74.alwaysdata.net/hammerapi/scores?ts=${Date.now()}`);
        if (!response.ok) throw new Error('Erreur chargement scores');
        const data = await response.json();

        console.log("📊 Scores reçus de l'API :", data);

        if (data.length > 0) {
            document.getElementById('best-player').textContent = data[0].name || 'PSEUDO';
            document.getElementById('best-score').textContent = data[0].score || '999';

            const standingsList = document.getElementById('standings-list');
            standingsList.innerHTML = '';
            for (let i = 1; i < Math.min(data.length, 10); i++) {
                const li = document.createElement('li');
                li.textContent = `${i + 1}${getOrdinalSuffix(i + 1)} - ${data[i].name} : ${data[i].score}`;
                standingsList.appendChild(li);
            }
            for (let i = data.length; i < 10; i++) {
                const li = document.createElement('li');
                li.textContent = `${i + 1}${getOrdinalSuffix(i + 1)} -`;
                standingsList.appendChild(li);
            }
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function getOrdinalSuffix(num) {
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
}

// 📡 Pusher : écoute les scores en temps réel
function setupPusher() {
    const pusher = new Pusher("95eb32a3909b0ed379b1", {
        cluster: "eu",
    });

    const channel = pusher.subscribe("hammergame");
    channel.bind("score-update", async function (data) {
        const score = parseInt(data.score, 10);
        const playerName = sessionStorage.getItem('playerName') || 'JOUEUR';

        console.log("📩 Nouveau score reçu :", score);
        document.getElementById("current-score").textContent = score;

        // 🔄 Récupère l'ID du joueur
        const playerId = await getOrCreatePlayer(playerName);

        if (playerId) {
            await sendScoreToAPI(playerId, score, data.hit_strength || 0);
        } else {
            console.warn("❌ Impossible d’envoyer le score : ID joueur introuvable");
        }

        // Emoji & animation
        const emojiElement = document.getElementById('emoji');
        let emoji = '';
        let message = '';
        if (score === 999) {
            emoji = '🤯'; message = 'Tout simplement inoui !';
        } else if (score < 250) {
            emoji = '😢'; message = 'Dommage !';
        } else if (score < 500) {
            emoji = '😐'; message = 'Tu peux mieux faire !';
        } else if (score < 750) {
            emoji = '😊'; message = 'Bravo !';
        } else {
            emoji = '😁'; message = 'Excellent !';
        }

        emojiElement.textContent = `${emoji} ${message}`;
        emojiElement.classList.add('bounce');
        setTimeout(() => emojiElement.classList.remove('bounce'), 500);

        if (score >= 750) {
            launchConfetti();
        } else if (score >= 500) {
            launchConfetti2();
        }
    });

    console.log("✅ Connecté à Pusher");
}

// 🎉 Confettis
function launchConfetti() {
    confetti({
        particleCount: 1000,
        spread: 150,
        angle: 90,
        origin: { y: 0.9 },
        colors: ['#D00000', '#FFBA08', '#3F88C5', '#032B43', '#136F63'],
        shapes: ['circle', 'square', 'star'],
        scalar: 1.2,
        ticks: 200,
        gravity: 0.6,
        drift: 0.05,
    });
}

function launchConfetti2() {
    confetti({
        particleCount: 250,
        spread: 100,
        angle: 90,
        origin: { y: 0.9 },
        colors: ['#D00000', '#FFBA08', '#3F88C5', '#032B43', '#136F63'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
        ticks: 200,
        gravity: 0.6,
        drift: 0.05,
    });
}
