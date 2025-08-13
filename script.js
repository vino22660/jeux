// ===== Variables globales =====
let motAleatoire = "";
let motVisible = [];
let essais = 0;
let lettresJouees = [];
const limiteErreurs = 6;

// ===== Initialisation du jeu =====
function initialiserJeu() {
  motVisible = Array(motAleatoire.length).fill("_");
  document.getElementById("mot").textContent = motVisible.join(" ");

  essais = limiteErreurs;
  document.getElementById("compteur").textContent = `Il vous reste ${essais} essais`;

  lettresJouees = [];
  document.getElementById("lettres").textContent = "Lettres jouées : ";

  // Génération du clavier virtuel
  genererClavier();
}

// ===== Fonction pour gérer une lettre jouée =====
function proposerLettre(lettre) {
  lettre = lettre.toLowerCase();

  if (lettresJouees.includes(lettre)) return;

  lettresJouees.push(lettre);
  document.getElementById("lettres").textContent = "Lettres jouées : " + lettresJouees.join(", ");

  if (motAleatoire.includes(lettre)) {
    for (let i = 0; i < motAleatoire.length; i++) {
      if (motAleatoire[i] === lettre) {
        motVisible[i] = lettre;
      }
    }
  } else {
    essais--;
  }

  document.getElementById("mot").textContent = motVisible.join("");
  document.getElementById("compteur").textContent = `Il vous reste ${essais} essais`;

  // Désactive le bouton correspondant du clavier virtuel
  const boutons = document.querySelectorAll("#clavier button");
  boutons.forEach(b => { if (b.textContent === lettre) b.disabled = true; });

  verifierFinDePartie();
}

// ===== Vérification fin de partie =====
function verifierFinDePartie() {
  if (!motVisible.includes("_")) {
    alert(`Félicitations ! Vous avez trouvé le mot : ${motAleatoire}`);
    return;
  }

  if (essais <= 0) {
    alert(`Perdu ! Le mot était : ${motAleatoire}`);
    return;
  }
}

// ===== Clavier virtuel =====
function genererClavier() {
  const lettresAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const clavierDiv = document.getElementById("clavier");
  clavierDiv.innerHTML = ""; // vide avant de recréer

  lettresAlphabet.forEach(l => {
    const bouton = document.createElement("button");
    bouton.textContent = l;
    bouton.addEventListener("click", () => proposerLettre(l));
    clavierDiv.appendChild(bouton);
  });
}

// ===== Chargement du mot depuis mots.txt =====
fetch("mots.txt")
  .then(reponse => reponse.text())
  .then(data => {
    const listeMots = data.split("\n").map(m => m.trim()).filter(m => m.length > 0);
    motAleatoire = listeMots[Math.floor(Math.random() * listeMots.length)];
    initialiserJeu();
  })
  .catch(err => console.error("Erreur de chargement :", err));

// ===== Clavier physique pour desktop =====
document.addEventListener("keydown", (event) => {
  const lettre = event.key;
  if (/^[a-zA-Z]$/.test(lettre)) proposerLettre(lettre);
});

