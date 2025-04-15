document.addEventListener('DOMContentLoaded', function() {
    // Récupérer le nom du joueur depuis sessionStorage
    const playerName = sessionStorage.getItem('playerName') || 'JOUEUR';
    
    // Animation du titre
    const title = document.querySelector('.title');
    setInterval(() => {
        title.style.textShadow = `0 0 ${Math.random() * 15 + 5}px rgba(255, 0, 0, 0.7)`;
    }, 500);
    
    // Bouton retour
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Fonction pour charger les meilleurs scores
    async function loadTopScores() {
        try {
            const response = await fetch('api/top_score.php');
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des scores');
            }
            
            const data = await response.json();
            
            // Mettre à jour le meilleur joueur et score
            if (data.length > 0) {
                document.getElementById('best-player').textContent = data[0].name || 'PSEUDO';
                document.getElementById('best-score').textContent = data[0].score || '999';
                
                // Mettre à jour le classement
                const standingsList = document.getElementById('standings-list');
                standingsList.innerHTML = ''; // Effacer la liste existante
                
                // Afficher les positions 2 à 10 (ou moins si moins de données)
                for (let i = 1; i < Math.min(data.length, 10); i++) {
                    const li = document.createElement('li');
                    li.textContent = `${i + 1}${getOrdinalSuffix(i + 1)} - ${data[i].name} : ${data[i].score}`;
                    standingsList.appendChild(li);
                }
                
                // Compléter avec des entrées vides si nécessaire
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
    
    // Fonction pour obtenir le suffixe ordinal (st, nd, rd, th)
    function getOrdinalSuffix(num) {
        if (num === 2) return 'nd';
        if (num === 3) return 'rd';
        return 'th';
    }
    
    // Fonction pour mettre à jour le score en temps réel
    function setupScoreUpdates() {
        // Simuler la réception de données du Raspberry Pi
        // Dans un cas réel, vous utiliseriez WebSockets ou des requêtes périodiques
        
        // Exemple avec des requêtes périodiques
        setInterval(async () => {
            try {
                // Requête pour obtenir le score actuel
                const response = await fetch(`api/current_score.php?player=${playerName}`);
                
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('current-score').textContent = data.score || '0';
                }
            } catch (error) {
                console.error('Erreur de mise à jour du score:', error);
            }
        }, 1000); // Mise à jour toutes les secondes
    }
    
    // Charger les meilleurs scores au démarrage
    loadTopScores();
    
    // Configurer les mises à jour de score
    setupScoreUpdates();
});