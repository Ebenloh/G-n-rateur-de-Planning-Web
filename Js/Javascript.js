// 1. BASE DE DONNÉES DES MATIÈRES PAR FILIÈRE
const matieresParFiliere = {
    "IDA": ["ALGORITHME", "POO", "BASE DE DONNEES", "DEVELOPPEMENT WEB", "PYTHON", "NEGOCIATION INFO", "ANGLAIS", "DROIT", "MERISE", "RESEAU"],
    "FC": ["COMPTABILITE GEN", "FISCALITE", "MATH FINANCIERE", "AUDIT", "CONTROLE DE GESTION", "DROIT DES AFFAIRES"],
    "RHCOM": ["GESTION DES RH", "COMMUNICATION", "DROIT DU TRAVAIL", "PSYCHOLOGIE", "MANAGEMENT"],
    "GEC": ["MARKETING", "TECHNIQUES DE VENTE", "FORCE DE VENTE", "ECONOMIE", "DROIT COMMERCIAL"],
    "GBAT": ["TOPOGRAPHIE", "RDM", "BETON ARME", "DESSIN BATIMENT", "HYDRAULIQUE"],
    "RIT": ["CISCO", "LINUX", "TRANSMISSION HF", "TELEPHONIE IP", "SECURITE RESEAU"]
};

// Récupération des données sauvegardées
let coursProgrammes = JSON.parse(localStorage.getItem('esetec_final_data')) || [];

document.addEventListener('DOMContentLoaded', () => {
    calculerAnneeAcademique();
    changerFiliere(); // Initialise le formulaire et le tableau
});

// 2. GESTION AUTOMATIQUE DE L'ANNÉE ACADÉMIQUE
function calculerAnneeAcademique() {
    const maintenant = new Date();
    const anneeActuelle = maintenant.getFullYear();
    const moisActuel = maintenant.getMonth(); // 0 = Janvier, 8 = Septembre

    let debut, fin;
    // Si on est entre Septembre et Décembre, l'année commence maintenant
    if (moisActuel >= 8) { 
        debut = anneeActuelle;
        fin = anneeActuelle + 1;
    } else { 
        // Si on est entre Janvier et Août, l'année a commencé l'an passé
        debut = anneeActuelle - 1;
        fin = anneeActuelle;
    }
    
    const texteAnnee = `${debut} - ${fin}`;
    document.getElementById('annee-auto').innerText = "Année Académique " + texteAnnee;
    document.getElementById('timetable-title').innerText = "EMPLOI DU TEMPS : " + texteAnnee;
}

// 3. MISE À JOUR DYNAMIQUE DES MATIÈRES
window.changerFiliere = function() {
    const filiere = document.getElementById('filiere-select').value;
    const matiereSelect = document.getElementById('prof-matiere');
    
    // Remplir la liste déroulante des matières
    const matieres = matieresParFiliere[filiere];
    matiereSelect.innerHTML = matieres.map(m => `<option value="${m}">${m}</option>`).join('');
    
    updateUI(); // Rafraîchir le tableau pour afficher les cours de cette filière
};

// 4. AJOUTER UN COURS (GESTION MULTI-JOURS)
window.ajouterCours = function() {
    const prof = document.getElementById('prof-name').value.trim();
    const matiere = document.getElementById('prof-matiere').value;
    const tranche = document.getElementById('time-select').value;
    const filiere = document.getElementById('filiere-select').value;
    
    // Récupérer tous les jours cochés
    const joursCoches = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value);

    if (!prof) return alert("Veuillez entrer le nom du professeur !");
    if (joursCoches.length === 0) return alert("Veuillez cocher au moins un jour !");

    joursCoches.forEach(jour => {
        // Vérifier si la case est déjà occupée
        const existeDeja = coursProgrammes.find(c => c.filiere === filiere && c.jour === jour && c.tranche === tranche);
        
        if (!existeDeja) {
            coursProgrammes.push({ prof, matiere, jour, tranche, filiere });
        } else {
            console.log(`Conflit évité pour ${jour} à ${tranche}`);
        }
    });
    
    localStorage.setItem('esetec_final_data', JSON.stringify(coursProgrammes));
    updateUI();
    
    // Réinitialisation des champs
    document.getElementById('prof-name').value = "";
    document.querySelectorAll('.day-checkbox').forEach(cb => cb.checked = false);
};

// 5. MISE À JOUR DU TABLEAU (INTERFACE)
function updateUI() {
    const container = document.getElementById('schedule-container');
    const filiereSelectionnee = document.getElementById('filiere-select').value;
    
    // Mise à jour du titre de la filière
    document.getElementById('display-filiere-title').innerText = "FILIÈRE : " + filiereSelectionnee;

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const tranches = ["08h00 - 10h00", "10h15 - 12h15", "13h00 - 15h00", "15h00 - 17h00"];

    let html = `<table>
        <thead>
            <tr>
                <th>HORAIRES</th>
                ${jours.map(j => `<th>${j.toUpperCase()}</th>`).join('')}
            </tr>
        </thead>
        <tbody>`;

    tranches.forEach(t => {
        html += `<tr><td class="time-slot"><b>${t}</b></td>`;
        jours.forEach(j => {
            // Chercher le cours correspondant
            const cours = coursProgrammes.find(c => c.filiere === filiereSelectionnee && c.jour === j && c.tranche === t);
            
            if (cours) {
                html += `
                <td class="cell">
                    <div class="matiere-title">${cours.matiere}</div>
                    <div class="prof-name">${cours.prof}</div>
                    <button class="no-print delete-btn" onclick="supprimerCours('${cours.filiere}','${j}','${t}')" title="Supprimer">×</button>
                </td>`;
            } else {
                html += `<td class="cell empty">---</td>`;
            }
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// 6. SUPPRIMER UN COURS PRÉCIS
window.supprimerCours = function(f, j, t) {
    if(confirm("Supprimer ce créneau ?")) {
        coursProgrammes = coursProgrammes.filter(c => !(c.filiere === f && c.jour === j && c.tranche === t));
        localStorage.setItem('esetec_final_data', JSON.stringify(coursProgrammes));
        updateUI();
    }
};

// 7. RÉINITIALISATION TOTALE
window.reinitialiserTout = function() {
    if(confirm("ATTENTION : Cela effacera TOUS les emplois du temps de TOUTES les filières. Continuer ?")) {
        localStorage.removeItem('esetec_final_data');
        coursProgrammes = [];
        updateUI();
    }
};
