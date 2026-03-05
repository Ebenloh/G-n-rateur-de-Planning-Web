const matieresParFiliere = {
    "IDA-1": ["ALGORITHME", "POO", "BASE DE DONNEES", "LANGAGE EVOLUE(DEV WEB ET PHP)", "COMPTABILITE GENERAL", "NEGOCIATION INFO", "ANGLAIS", "DROIT", "MERISE", "RESEAU INFORMATIQUE", "EOE", "TECHNIQUE D'ADMINISTRATION", "ENTREPREUNERIAT", "VISUAL BASIC", "ARCHITECTURE CLIENT/SERVEUR", "TEEO", "MATH GEN", "MATH FIN", "STATISTIQUE APPLIQUEES", "LANGAGE PASCAL", "ECONOMIE GEN",],
    "IDA-2": ["ALGORITHME", "POO", "BASE DE DONNEES", "LANGAGE EVOLUE(DEV WEB ET PHP)", "COMPTABILITE GENERAL", "NEGOCIATION INFO", "ANGLAIS", "DROIT", "MERISE", "RESEAU INFORMATIQUE", "EOE", "TECHNIQUE D'ADMINISTRATION", "ENTREPREUNERIAT", "VISUAL BASIC", "ARCHITECTURE CLIENT/SERVEUR", "TEEO", "MATH GEN", "MATH FIN", "STATISTIQUE APPLIQUEES", "LANGAGE PASCAL", "ECONOMIE GEN",],
    "FCGE-1": ["COMPTABILITE ANALYTIQUE", "FISCALITE", "MATH FINE", "AUDIT", "DROIT", "MATH GEN", "ANGLAIS", "ENTREPREUNERIAT" ],
    "FCGE-2": ["COMPTABILITE ANALYTIQUE", "FISCALITE", "MATH FINE", "AUDIT", "DROIT", "MATH GEN", "ANGLAIS", "ENTREPREUNERIAT" ],
    "RHCOM-1": ["GESTION RH", "COMMUNICATION", "DROIT DU TRAVAIL"],
    "RHCOM-2": ["GESTION RH", "COMMUNICATION", "DROIT DU TRAVAIL"],
    "GEC-1": ["MARKETING", "TECHNIQUES DE VENTE"],
    "GEC-2": ["MARKETING", "TECHNIQUES DE VENTE"],
    "GBAT-1": ["TOPOGRAPHIE", "RDM", "BETON ARME"],
    "GBAT-2": ["TOPOGRAPHIE", "RDM", "BETON ARME"],
    "RIT-1": ["CISCO", "LINUX", "TRANSMISSION HF"],
    "RIT-2": ["CISCO", "LINUX", "TRANSMISSION HF"],
    "GERNA-1": ["ANGLAIS", "MECANIQUE QUANTIQUE", "BIOLOGIE CELULAIRE", "MATH GEN", "PHYSIQUE", "ECONOMIE GENERALE", "STATISTIQUE APPLIQUEES", "INFORMATIQUE APPLIQUEE", "DROIT DES AFFAIRE ET DU TRAVAIL", "TEEO"],
    "GERNA-2": ["ANGLAIS", "MECANIQUE QUANTIQUE", "BIOLOGIE CELULAIRE", "MATH GEN", "PHYSIQUE", "ECONOMIE GENERALE", "STATISTIQUE APPLIQUEES", "INFORMATIQUE APPLIQUEE", "DROIT DES AFFAIRE ET DU TRAVAIL", "TEEO"],
};

let coursProgrammes = JSON.parse(localStorage.getItem('esetec_final_data')) || [];

document.addEventListener('DOMContentLoaded', () => {
    changerFiliere(); // Initialise les matières au chargement
    calculerAnneeAcademique();
});

function changerFiliere() {
    const filiere = document.getElementById('filiere-select').value;
    const matiereSelect = document.getElementById('prof-matiere');
    matiereSelect.innerHTML = matieresParFiliere[filiere].map(m => `<option value="${m}">${m}</option>`).join('');
    updateUI();
}

function ajouterCours() {

    const prof = document.getElementById('prof-name').value.trim();
    const matiere = document.getElementById('prof-matiere').value;
    const tranche = document.getElementById('time-select').value;
    const filiere = document.getElementById('filiere-select').value;
    const salle = document.getElementById('salle').value.trim();

    const joursCoches = Array.from(
        document.querySelectorAll('.day-checkbox:checked')
    ).map(cb => cb.value);

    if (!prof) return alert("Entrez le nom du professeur !");
    if (!salle) return alert("Entrez la salle !");
    if (joursCoches.length === 0)
        return alert("Sélectionnez au moins un jour !");

    joursCoches.forEach(jour => {

        const existeDeja = coursProgrammes.find(c =>
            c.filiere === filiere &&
            c.jour === jour &&
            c.tranche === tranche
        );

        if (!existeDeja) {
            coursProgrammes.push({
                prof,
                matiere,
                salle,
                jour,
                tranche,
                filiere
            });
        }
    });

    localStorage.setItem(
        'esetec_final_data',
        JSON.stringify(coursProgrammes)
    );

    updateUI();

    document.getElementById('prof-name').value = "";
    document.getElementById('salle').value = "";
    document.querySelectorAll('.day-checkbox').forEach(cb => cb.checked = false);
}

// FONCTION POUR L'ANNÉE AUTOMATIQUE
function calculerAnneeAcademique() {
    const maintenant = new Date();
    const anneeActuelle = maintenant.getFullYear();
    const moisActuel = maintenant.getMonth(); // 0 = Janvier

    let debut, fin;
    if (moisActuel >= 8) { // Si on est après Août
        debut = anneeActuelle;
        fin = anneeActuelle + 1;
    } else {
        debut = anneeActuelle - 1;
        fin = anneeActuelle;
    }
    
    const texteAnnee = `Année Académique ${debut} - ${fin}`;
    document.getElementById('annee-auto').innerText = texteAnnee;
    document.getElementById('timetable-title').innerText = `EMPLOI DU TEMPS : ${debut} - ${fin}`;
}

// ... garde tes fonctions ajouterCours(), supprimerCours() et updateUI() ici ...
// (Assure-toi de bien utiliser les checkboxes pour les jours comme dans le message précédent)

function updateUI() {
    const container = document.getElementById('schedule-container');
    const currentFiliere = document.getElementById('filiere-select').value;

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    const tranchesMatin = ["08h00 - 10h00", "10h15 - 12h15"];
    const tranchesApresMidi = ["13h00 - 15h00", "15h00 - 17h00"];

    const texteAffiche = document.getElementById('filiere-select').selectedOptions[0].text;
document.getElementById('display-filiere-title').innerText =
    "FILIÈRE : " + texteAffiche;
    
    let html = `
    <table>
        <thead>
            <tr>
                <th>HORAIRES</th>
                ${jours.map(j => `<th>${j.toUpperCase()}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
    `;

    // ===== MATIN =====
    tranchesMatin.forEach(t => {
        html += `<tr><td class="time-slot"><b>${t}</b></td>`;

        jours.forEach(j => {
            const cours = coursProgrammes.find(c =>
                c.filiere === currentFiliere &&
                c.jour === j &&
                c.tranche === t
            );

            html += genererCellule(cours, currentFiliere, j, t);
        });

        html += `</tr>`;
    });

    // ===== SÉPARATION APRÈS-MIDI =====
    html += `
        <tr class="separator-row">
            <td colspan="7" class="separator-cell">
                APRÈS-MIDI
            </td>
        </tr>
    `;

    // ===== APRÈS-MIDI =====
    tranchesApresMidi.forEach(t => {
        html += `<tr><td class="time-slot"><b>${t}</b></td>`;

        jours.forEach(j => {
            const cours = coursProgrammes.find(c =>
                c.filiere === currentFiliere &&
                c.jour === j &&
                c.tranche === t
            );

            html += genererCellule(cours, currentFiliere, j, t);
        });

        html += `</tr>`;
    });

    container.innerHTML = html + `</tbody></table>`;
}

function genererCellule(cours, filiere, jour, tranche) {

    if (cours) {
        return `
        <td class="cell" contenteditable="true"
            onblur="sauvegarderModification(this,'${filiere}','${jour}','${tranche}')">

            <div class="matiere-title">${cours.matiere}</div>
            <div class="prof-name">${cours.prof}</div>
            <div class="salle-name">Salle : ${cours.salle}</div>

            <button class="no-print delete-btn"
                onclick="supprimerCours('${filiere}','${jour}','${tranche}')">
                ×
            </button>
        </td>`;
    } else {
        return `
        <td class="cell empty" contenteditable="true"
            onblur="sauvegarderModification(this,'${filiere}','${jour}','${tranche}')">
        </td>`;
    }
}

function sauvegarderModification(cell, filiere, jour, tranche) {

    const texte = cell.innerText.trim();
    if (!texte) return;

    const lignes = texte.split("\n");

    const matiere = lignes[0] || "";
    const prof = lignes[1] || "";
    const salle = lignes[2] ? lignes[2].replace("Salle :", "").trim() : "";

    const index = coursProgrammes.findIndex(c =>
        c.filiere === filiere &&
        c.jour === jour &&
        c.tranche === tranche
    );

    if (index !== -1) {
        coursProgrammes[index].matiere = matiere;
        coursProgrammes[index].prof = prof;
        coursProgrammes[index].salle = salle;
    } else {
        coursProgrammes.push({
            filiere,
            jour,
            tranche,
            matiere,
            prof,
            salle
        });
    }

    localStorage.setItem(
        'esetec_final_data',
        JSON.stringify(coursProgrammes)
    );
}

function supprimerCours(f, j, t) {
    coursProgrammes = coursProgrammes.filter(c => !(c.filiere === f && c.jour === j && c.tranche === t));
    localStorage.setItem('esetec_final_data', JSON.stringify(coursProgrammes));
    updateUI();
}

function reinitialiserTout() {
    if(confirm("Êtes-vous sûr de vouloir effacer TOUT le planning ?")) {
        localStorage.removeItem('esetec_final_data');
        coursProgrammes = [];
        updateUI();
    }
}
