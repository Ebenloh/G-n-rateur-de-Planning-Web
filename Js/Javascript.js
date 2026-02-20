const matieresParFiliere = {
    "IDA": ["ALGORITHME", "POO", "BASE DE DONNEES", "DEVELOPPEMENT WEB", "PYTHON", "NEGOCIATION INFO", "ANGLAIS", "DROIT", "MERISE", "RESEAU"],
    "FC": ["COMPTABILITE", "FISCALITE", "MATH FINANCIERE", "AUDIT"],
    "RHCOM": ["GESTION RH", "COMMUNICATION", "DROIT DU TRAVAIL"],
    "GEC": ["MARKETING", "TECHNIQUES DE VENTE"],
    "GBAT": ["TOPOGRAPHIE", "RDM", "BETON ARME"],
    "RIT": ["CISCO", "LINUX", "TRANSMISSION HF"]
};

let coursProgrammes = JSON.parse(localStorage.getItem('esetec_final_data')) || [];

document.addEventListener('DOMContentLoaded', () => {
    changerFiliere(); // Initialise les matières au chargement
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
    const joursCoches = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value);

    if (!prof) return alert("Entrez le nom du professeur !");
    if (joursCoches.length === 0) return alert("Sélectionnez au moins un jour !");

    joursCoches.forEach(jour => {
        const existeDeja = coursProgrammes.find(c => c.filiere === filiere && c.jour === jour && c.tranche === tranche);
        if (!existeDeja) {
            coursProgrammes.push({ prof, matiere, jour, tranche, filiere });
        }
    });
    
    localStorage.setItem('esetec_final_data', JSON.stringify(coursProgrammes));
    updateUI();
    document.getElementById('prof-name').value = "";
    document.querySelectorAll('.day-checkbox').forEach(cb => cb.checked = false);
}

document.addEventListener('DOMContentLoaded', () => {
    calculerAnneeAcademique();
    changerFiliere(); 
});

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
    const tranches = ["08h00 - 10h00", "10h15 - 12h15", "13h00 - 15h00", "15h00 - 17h00"];
    // À ajouter dans la fonction updateUI()
    const filiereSelectionnee = document.getElementById('filiere-select').value;
    document.getElementById('display-filiere-title').innerText = "FILIÈRE : " + filiereSelectionnee;
    let html = `<table><thead><tr><th>HORAIRES</th>${jours.map(j => `<th>${j.toUpperCase()}</th>`).join('')}</tr></thead><tbody>`;

    tranches.forEach(t => {
        html += `<tr><td class="time-slot"><b>${t}</b></td>`;
        jours.forEach(j => {
            const cours = coursProgrammes.find(c => c.filiere === currentFiliere && c.jour === j && c.tranche === t);
            if (cours) {
                html += `<td class="cell">
                    <div class="matiere-title">${cours.matiere}</div>
                    <div class="prof-name">${cours.prof}</div>
                    <button class="no-print delete-btn" onclick="supprimerCours('${cours.filiere}','${j}','${t}')">×</button>
                </td>`;
            } else {
                html += `<td class="cell empty">---</td>`;
            }
        });
        html += `</tr>`;
    });
    container.innerHTML = html + `</tbody></table>`;
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
