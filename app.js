document.addEventListener('DOMContentLoaded', function () {
    // Animation du titre
    const title = document.querySelector('.title');
    setInterval(() => {
        title.style.textShadow = `0 0 ${Math.random() * 15 + 5}px rgba(255, 0, 0, 0.7)`;
    }, 500);

    // Charger les scores dynamiquement
    fetch('api/top_scores.php')
        .then(res => res.json())
        .then(scores => {
            const standingsList = document.querySelector('.standings-list');
            const bestScoreDiv = document.querySelector('.best-score');

            standingsList.innerHTML = '';
            scores.forEach((entry, index) => {
                if (index === 0) {
                    bestScoreDiv.innerHTML = `
<div>1st - ${entry.pseudo} :</div>
<div>${entry.score}</div>`;
                } else {
                    standingsList.innerHTML += `<li>${index + 1}th - ${entry.pseudo} : ${entry.score}</li>`;
                }
            });
        })
        .catch(err => {
            console.error('Erreur de chargement des scores :', err);
        });
});