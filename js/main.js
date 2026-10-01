// Fonction pour copier l'IP du serveur dans le presse-papiers
function copyIP() {
    const ip = "141.253.113.74";
    navigator.clipboard.writeText(ip).then(() => {
        alert("IP copiée dans le presse-papiers: " + ip);
    }).catch(err => {
        console.error("Erreur lors de la copie: ", err);
        // Méthode de secours pour les navigateurs plus anciens
        const textarea = document.createElement("textarea");
        textarea.value = ip;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("IP copiée dans le presse-papiers: " + ip);
    });
}

// Fonction pour simuler un compteur de joueurs en ligne (à remplacer par une vraie API plus tard)
function updatePlayerCount() {
    // Pour l'instant, on génère un nombre aléatoire pour la démo
    const randomCount = Math.floor(Math.random() * 20);
    document.getElementById("player-count").textContent = randomCount;
}

// Mettre à jour le compteur de joueurs toutes les 30 secondes
setInterval(updatePlayerCount, 30000);

// Initialiser le compteur de joueurs au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    updatePlayerCount();
    
    // Ajouter des animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments qui doivent apparaître avec une animation
    const animatedElements = document.querySelectorAll(".feature-card, .info-card, .game-card, .blog-post");
    animatedElements.forEach(el => observer.observe(el));
});

// Fonction pour gérer le clic sur les liens Hytale (si le protocole n'est pas reconnu)
document.addEventListener("click", function(e) {
    if (e.target.closest("a[href^='hytale://']")) {
        e.preventDefault();
        const ip = "141.253.113.74";
        alert("Pour rejoindre le serveur, ouvrez Hytale et connectez-vous à l'adresse: " + ip);
    }
});

// Fonction pour ajouter un effet de survol sur les cartes
document.querySelectorAll(".feature-card, .info-card, .game-card, .blog-post").forEach(card => {
    card.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-5px)";
    });
    
    card.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
    });
});
