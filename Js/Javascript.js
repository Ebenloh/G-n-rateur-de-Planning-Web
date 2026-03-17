const matieresParFiliere = {
    "IDA-1": ["ALGORITHME", "P.O.O.E", "BASE DE DONNEES", "LANGAGE EVOLUE(DEV WEB ET PHP)", "COMPTABILITE GENERAL", "NEGOCIATION INFO", "ANGLAIS", "DROIT", "MERISE", "RESEAU INFORMATIQUE", "EOE", "TECHNIQUE D'ADMINISTRATION", "ENTREPREUNERIAT", "VISUAL BASIC", "ARCHITECTURE CLIENT/SERVEUR", "TEEO", "MATH GEN", "MATH FIN", "STATISTIQUE APPLIQUEES", "LANGAGE PASCAL", "ECONOMIE GEN"],
    "IDA-2": ["ALGORITHME", "P.O.O.E", "BASE DE DONNEES", "LANGAGE EVOLUE(DEV WEB ET PHP)", "COMPTABILITE GENERAL", "NEGOCIATION INFO", "ANGLAIS", "Droit des Affaires et du Travail", "MERISE", "RESEAU INFORMATIQUE", "E.O.E", "TECHNIQUE D'ADMINISTRATION", "ENTREPREUNERIAT", "VISUAL BASIC", "ARCHITECTURE CLIENT/SERVEUR", "TEEO", "MATH GEN", "MATH FIN", "STATISTIQUE APPLIQUEES", "LANGAGE PASCAL", "ECONOMIE GEN", "LANGAGE PASCAL",],
    "FCGE-2": ["MARKETING", "CONTROLE DE GESTION", "MATH GEN", "MATH FIN ET RO", "ANGLAIS", "ECONOMIE ET EOE", "COMPTABILITE GENERALE", "GESTION FINANCIERE", "COMPTABILITE DES SOCIETES", "DROIT DES AFFAIRES ET DU TRAVAIL", "FISCALITE", "INFORMATIQUE APPLIQUEE", "TEEO"],
    "FCGE-2": ["MARKETING", "CONTROLE DE GESTION", "MATH GEN", "MATH FIN ET RO", "ANGLAIS", "ECONOMIE ET EOE", "COMPTABILITE GENERALE", "GESTION FINANCIERE", "COMPTABILITE DES SOCIETES", "DROIT DES AFFAIRES ET DU TRAVAIL", "FISCALITE", "INFORMATIQUE APPLIQUEE", "TEEO"],
    "RHC-1": ["ANGLAIS", "PROCESSUS DE PRODUCTION MEDIA", "COMMUNICATION D'ENTREPRISE", "EOE", "ECONOMIE GENERALE", "MARKETING ET POLITIQUE DE COMMUNICATION", "ENQUETE DE SATISFACTION", "DEVELOPPEMENT DES RESSOURCES HUMAINES", "PSYCHO-SOCIOLOGIE", "TECHNIQUES DE COMMUNICATION ET D'ANIMATION", "STATISTIQUE APPLIQUEES", "INFORMATIQUE APPLIQUEE", "COMPTABILITE GENERALE", "DROIT DES AFFAIRES ET DU TRAVAIL", "LEGISLATION DU TRAVAIL", "TEEO"],
    "RHC-2": ["PROCESSUS DE PRODUCTION MEDIA", "MARKETING ET POLITIQUE DE COMMUNICATION", "ENQUETE DE SATISFACTION", "ANGLAIS", "ECONOMIE ET EOE", "PSYCHO-SOCIOLOGIE", "TECHNIQUES DE COMMUNICATION ET D'ANIMATION", "NEGOCIATIONS ET RELATIONS SOCIALES", "COMMUNICATION D'ENTREPRISE", "DEVELOPPEMENT DES RESSOURCES HUMAINES", "STATISTIQUE APPLIQUEES", "LEGISLATION DU TRAVAIL", "DROIT DES AFFAIRES ET DU TRAVAIL", "COMPTA - REMUNERATION", "INFORMATIQUE APPLIQUEE", "TEEO"],
    "GEC-1": ["MARKETING", "TECHNIQUES DE VENTE"],
    "GEC-2": ["MARKETING", "TECHNIQUES DE VENTE"],
    "GBAT-1": ["TOPOGRAPHIE", "RDM", "BETON ARME"],
    "GBAT-2": ["TOPOGRAPHIE", "RDM", "BETON ARME"],
    "LOG-1": ["ANGLAIS", "EOE", "ECONOMIE GENERALE", "GESTION DES MOYENS GENERAUX", "MATH GEN", "MANAGEMENT DES TRANSPORTS", "COMPTABILITE ANALYTIQUE ET GESTION PREVISIONNELLE", "STATISTIQUE APPLIQUEES", "INFORMATIQUE APPLIQUEE", "COMPTABILITE GENERALE", "DROIT DES AFFAIRES ET DU TRAVAIL", "MATH FIN ET RO", "TEEO"],
    "RIT-1": ["TRAITEMENT DE SIGNAL", "MATH GEN", "COMPTABILITE FINANCIERE (GESTION)", "RESEAUX LOCAUX ET INFORMATIQUES", "ANGLAIS", "ECONOMIE ET EOE", "ELECTRONIQUE ANALOGIQUE ET NUMERIQUE", "RESEAUX D'ACCES ET TP", "SYSTEME D'EXPLOITATION - SECURITE", "TELEINFORMATIQUE", "ENTREPREUNERIAT", "DROIT DES AFFAIRES ET DU TRAVAIL", "COMMUTATION", "TEEO", "TRANSMISSION ANALOGIQUE", "TRANSMISSION NUMERIQUE"],
    "RIT-2": ["TRAITEMENT DE SIGNAL", "MATH GEN", "COMPTABILITE FINANCIERE (GESTION)", "RESEAUX LOCAUX ET INFORMATIQUES", "ANGLAIS", "ECONOMIE ET EOE", "ELECTRONIQUE ANALOGIQUE ET NUMERIQUE", "RESEAUX D'ACCES ET TP", "SYSTEME D'EXPLOITATION - SECURITE", "TELEINFORMATIQUE", "ENTREPREUNERIAT", "DROIT DES AFFAIRES ET DU TRAVAIL", "COMMUTATION", "TEEO", "TRANSMISSION ANALOGIQUE", "TRANSMISSION NUMERIQUE"],
    "IACC-1": ["ANGLAIS", "BIOCHIMIE", "ATOMISTIQUE", "MATH GEN", "STATISTIQUE APPLIQUEES", "INFORMATIQUE APPLIQUEE", "MICROBIOLOGIE", "TEEO", "TP CHIMIE", "THERMODYNAMIQUE"],
    "IACC-2": ["QUALITE (LEGISLATION)", "BIOCHIMIE", "ANGLAIS", "MICROBIOLOGIE", "MATH GEN", "CHIMIE GENERALE", "TP CHIMIE", "STATISTIQUE APPLIQUEES", "QUALITE NORMALISATION", "INFORMATIQUE APPLIQUEE", "TEEO"],
    "GERNA-1": ["ANGLAIS", "MECANIQUE QUANTIQUE", "BIOLOGIE CELULAIRE", "MATH GEN", "PHYSIQUE", "ECONOMIE GENERALE", "STATISTIQUE APPLIQUEES", "INFORMATIQUE APPLIQUEE", "DROIT DES AFFAIRE ET DU TRAVAIL", "TEEO"],
    "GERNA-2": ["ANGLAIS", "MECANIQUE QUANTIQUE", "BIOLOGIE CELULAIRE", "MATH GEN", "PHYSIQUE", "ECONOMIE GENERALE", "STATISTIQUE APPLIQUEES", "INFORMATIQUE APPLIQUEE", "DROIT DES AFFAIRE ET DU TRAVAIL", "TEEO"],
};

let coursProgrammes = JSON.parse(localStorage.getItem('esetec_final_data')) || [];

document.addEventListener('DOMContentLoaded', () => {
    changerFiliere();
    calculerAnneeAcademique();
});

function changerFiliere() {
    const filiere = document.getElementById('filiere-select').value;
    const matiereSelect = document.getElementById('prof-matiere');

    matiereSelect.innerHTML =
        matieresParFiliere[filiere]
        .map(m => `<option value="${m}">${m}</option>`)
        .join('');

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


// ANNÉE ACADÉMIQUE AUTOMATIQUE
function calculerAnneeAcademique() {

    const maintenant = new Date();
    const anneeActuelle = maintenant.getFullYear();
    const moisActuel = maintenant.getMonth();

    let debut, fin;

    if (moisActuel >= 8) {
        debut = anneeActuelle;
        fin = anneeActuelle + 1;
    } else {
        debut = anneeActuelle - 1;
        fin = anneeActuelle;
    }

    const texteAnnee = `Année Académique ${debut} - ${fin}`;

    document.getElementById('annee-auto').innerText = texteAnnee;
    document.getElementById('timetable-title').innerText =
        `EMPLOI DU TEMPS : ${debut} - ${fin}`;
}



function updateUI() {

    const container = document.getElementById('schedule-container');
    const currentFiliere = document.getElementById('filiere-select').value;

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    const tranchesMatin = [
        "08h00 - 10h00",
        "10h15 - 12h15"
    ];

    const tranchesApresMidi = [
        "13h00 - 15h00",
        "15h00 - 17h00"
    ];

    const texteAffiche =
        document.getElementById('filiere-select')
        .selectedOptions[0].text;

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


    // MATIN
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


    // SÉPARATION PROFESSIONNELLE
    html += `
        <tr class="separator-row">
            <td colspan="7" class="separator-cell">
                ─────────  APRÈS-MIDI  ─────────
            </td>
        </tr>
    `;


    // APRÈS MIDI
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
    }

    else {

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
    const salle = lignes[2]
        ? lignes[2].replace("Salle :", "").trim()
        : "";

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

    coursProgrammes =
        coursProgrammes.filter(c =>
            !(c.filiere === f &&
              c.jour === j &&
              c.tranche === t)
        );

    localStorage.setItem(
        'esetec_final_data',
        JSON.stringify(coursProgrammes)
    );

    updateUI();
}



function reinitialiserTout() {

    if (confirm("Êtes-vous sûr de vouloir effacer TOUT le planning ?")) {

        localStorage.removeItem('esetec_final_data');

        coursProgrammes = [];

        updateUI();
    }
}
