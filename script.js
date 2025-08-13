// ===== Variables globales =====
let motAleatoire = "";      // Mot à deviner, choisi aléatoirement
let motVisible = [];        // Tableau qui contient "_" ou les lettres trouvées
let essais = 0;             // Nombre d'essais restants
let lettresJouees = [];     // Lettres déjà proposées par le joueur
const limiteErreurs = 6;    // Limite d'erreurs autorisées

// ===== Fonction d'initialisation du jeu =====
function initialiserJeu() {
  // Crée un tableau de "_" de la même longueur que le mot à deviner
  motVisible = Array(motAleatoire.length).fill("_");

  // Affiche le mot masqué dans le div avec des espaces entre chaque lettre
  document.getElementById("mot").textContent = motVisible.join(" ");

  // Réinitialise le compteur d'essais
  essais = limiteErreurs;
  document.getElementById("compteur").textContent = `Il vous reste ${essais} essais`;

  // Vide la liste des lettres déjà jouées
  lettresJouees = [];
  document.getElementById("lettres").textContent = "Lettres jouées : ";
}

// ===== Fonction pour gérer la proposition d'une lettre =====
function proposerLettre(lettre) {
  // Convertir la lettre en minuscule pour éviter les problèmes de casse
  lettre = lettre.toLowerCase();

  // Vérifie si la lettre a déjà été jouée
  if (lettresJouees.includes(lettre)) {
    alert("Vous avez déjà proposé cette lettre !");
    return; // On sort de la fonction
  }

  // Ajoute la lettre à la liste des lettres jouées
  lettresJouees.push(lettre);
  document.getElementById("lettres").textContent = "Lettres jouées : " + lettresJouees.join(", ");

  // Vérifie si la lettre est dans le mot
  if (motAleatoire.includes(lettre)) {
    // Parcours le mot et remplace les "_" par la lettre trouvée
    for (let i = 0; i < motAleatoire.length; i++) {
      if (motAleatoire[i] === lettre) {
        motVisible[i] = lettre;
      }
    }
  } else {
    // Lettre incorrecte → décrémente les essais restants
    essais--;
  }

  // Met à jour l'affichage du mot et du compteur
  document.getElementById("mot").textContent = motVisible.join(" ");
  document.getElementById("compteur").textContent = `Il vous reste ${essais} essais`;

  // Vérifie si la partie est terminée
  verifierFinDePartie();
}

// ===== Fonction qui vérifie si le joueur a gagné ou perdu =====
function verifierFinDePartie() {
  // Victoire : plus de "_" dans motVisible
  if (!motVisible.includes("_")) {
    alert(`Félicitations ! Vous avez trouvé le mot : ${motAleatoire}`);
    return;
  }

  // Défaite : plus d'essais
  if (essais <= 0) {
    alert(`Perdu ! Le mot était : ${motAleatoire}`);
    return;
  }
}

// ===== Récupération du mot depuis le fichier mots.txt =====
fetch("mots.txt")
  .then(reponse => reponse.text())
  .then(data => {
    // Transforme le fichier texte en tableau de mots
    const listeMots = data.split("\n").map(m => m.trim()).filter(m => m.length > 0);

    // Choisit un mot aléatoire dans la liste
    motAleatoire = listeMots[Math.floor(Math.random() * listeMots.length)];

    // Initialise le jeu avec ce mot
    initialiserJeu();
  })
  .catch(err => console.error("Erreur de chargement :", err));

// ===== Gestion de la saisie clavier =====
document.addEventListener("keydown", (event) => {
  const lettre = event.key;
  // On ne traite que les lettres a-z
  if (/^[a-zA-Z]$/.test(lettre)) {
    proposerLettre(lettre);
  }
});
