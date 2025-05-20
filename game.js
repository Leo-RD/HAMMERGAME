document.addEventListener('DOMContentLoaded', function () {
    const playerName = sessionStorage.getItem('playerName') || 'JOUEUR';
    createPlayer(playerName); // Enregistre le joueur à l’arrivée

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

    // Connexion Pusher
    setupPusher();
});

// 🧠 Crée un joueur
async function createPlayer(name) {
    try {
        const response = await fetch('https://tom74.alwaysdata.net/hammerapi/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, age: 0 })
        });
        if (!response.ok) {
            console.warn("❗ Impossible de créer le joueur (peut-être déjà existant)");
        } else {
            console.log('✅ Joueur créé');
        }
    } catch (error) {
        console.error('Erreur création joueur :', error);
    }
}

// 🧠 Envoie le score à l'API
async function sendScoreToAPI(playerName, score, hit_strength = 0) {
    try {
        const playersResponse = await fetch('https://tom74.alwaysdata.net/hammerapi/players');
        const players = await playersResponse.json();
        const player = players.find(p => p.name === playerName);
        if (!player) throw new Error('Joueur introuvable');

        const response = await fetch('https://tom74.alwaysdata.net/hammerapi/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player_id: player.id,
                score: score,
                hit_strength: hit_strength
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du score');
        }

        console.log('✅ Score envoyé à l’API');
    } catch (error) {
        console.error('Erreur envoi score :', error);
    }
}

// 🧠 Affiche les meilleurs scores
async function loadTopScores() {
    try {
        const response = await fetch('https://tom74.alwaysdata.net/hammerapi/scores');
        if (!response.ok) throw new Error('Erreur chargement scores');
        const data = await response.json();

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

// 📡 Pusher : écoute des scores en temps réel
function setupPusher() {
    const pusher = new Pusher("95eb32a3909b0ed379b1", {
        cluster: "eu",
    });

    const channel = pusher.subscribe("hammergame");
    channel.bind("score-update", function (data) {
        const score = parseInt(data.score, 10);
        const playerName = sessionStorage.getItem('playerName') || 'JOUEUR';

        console.log("📩 Nouveau score reçu :", score);
        document.getElementById("current-score").textContent = score;
        sendScoreToAPI(playerName, score, data.hit_strength || 0);

        const emojiElement = document.getElementById('emoji');
        let emoji = '';
        let message = '';
        if (score === 999) {
            emoji = '🤯';
            message = 'Tout simplement inoui !';
        } else if (score < 250) {
            emoji = '😢';
            message = 'Dommage !';
        } else if (score < 500) {
            emoji = '😐';
            message = 'Tu peux mieux faire !';
        } else if (score < 750) {
            emoji = '😊';
            message = 'Bravo !';
        } else {
            emoji = '😁';
            message = 'Excellent !';
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
// 🎉 Confettis