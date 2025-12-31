document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('schedule-container');
    const notes = document.getElementById('notes-content');
    const btnDownload = document.getElementById('btnDownload');

    const ecoleData = {
        "IDA": ["Algo", "POO", "Base de Données", "MERISE", "Droit", "Négociation informatique", "Economie Général", "Comptabilité", "Anglais", "Réseau", "developoement web", "Math fin", "Math Gen", "Économie générale", "Eco d'entreprise", "Français", "Entrepreneuriat"],
        "FC": ["Comptabilité Générale", "Fiscalité", "Maths Financières", "Contrôle de Gestion"],
        "RHCOM": ["Management", "Droit du Travail", "Psychologie sociale", "Communication"],
        "GEC": ["Étude de Marché", "Techniques de Vente", "Force de Vente"],
        "GBAT": ["Topographie", "RDM", "Béton Armé", "Dessin Bâtiment"],
        "RIT": ["Réseaux Mobiles", "Transmission HF", "Linux", "Cisco"]
    };

    let profs = JSON.parse(localStorage.getItem('esetec_profs_v3')) || [];

    // Ajouter un prof avec Spécialités ET Disponibilités
    window.ajouterProf = function() {
        const name = document.getElementById('prof-name').value.trim();
        const specsInput = document.getElementById('prof-specialites').value.trim();
        const dayChecks = document.querySelectorAll('.day-check:checked');
        
        if(!name || !specsInput || dayChecks.length === 0) {
            return alert("Veuillez remplir le nom, les matières et cocher au moins un jour de présence !");
        }

        const specialites = specsInput.split(',').map(s => s.trim());
        const dispos = Array.from(dayChecks).map(cb => cb.value);

        profs.push({ name, specialites, dispos });
        localStorage.setItem('esetec_profs_v3', JSON.stringify(profs));
        
        updateProfList();
        resetForm();
    };

    function resetForm() {
        document.getElementById('prof-name').value = "";
        document.getElementById('prof-specialites').value = "";
        document.querySelectorAll('.day-check').forEach(cb => cb.checked = false);
    }

    function updateProfList() {
        document.getElementById('list-profs').innerHTML = profs.map(p => `
            <li style="border-left: 4px solid var(--secondary); margin-bottom: 10px; padding-left: 10px;">
                <strong>${p.name}</strong><br>
                <small>📚 ${p.specialites.join(', ')}</small><br>
                <small>📅 <i>Dispo: ${p.dispos.join(', ')}</i></small>
            </li>
        `).join('');
    }

    // GÉNÉRATION AVEC DOUBLE VÉRIFICATION
    function generate() {
        const filiere = document.getElementById('filiere-select').value;
        const matieresFiliere = ecoleData[filiere];

        if(profs.length === 0) return alert("Ajoutez des professeurs d'abord !");

        const hours = ["08h - 09h", "09h - 10h", "10h20 - 12h", "13H - 14h", "14h - 15h", "15h - 16h", "16h - 17h"];
        const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

        let html = `<table><thead><tr><th>Heure</th>${days.map(d => `<th>${d}</th>`).join('')}</tr></thead><tbody>`;

        hours.forEach(time => {
            html += `<tr><td class="time-slot"><b>${time}</b></td>`;
            
            days.forEach(day => {
                // 1. Choisir la matière
                const matiereChoisie = matieresFiliere[Math.floor(Math.random() * matieresFiliere.length)];
                
                // 2. Filtrer les profs : qui fait cette matière ET est là ce jour ?
                const profsDisponiblesEtQualifies = profs.filter(p => 
                    p.specialites.some(s => s.toLowerCase().includes(matiereChoisie.toLowerCase())) &&
                    p.dispos.includes(day)
                );

                const profFinal = profsDisponiblesEtQualifies.length > 0 
                    ? profsDisponiblesEtQualifies[Math.floor(Math.random() * profsDisponiblesEtQualifies.length)].name 
                    : "⚠️ Aucun prof dispo";

                html += `<td contenteditable="true" class="cell">
                            <strong>${matiereChoisie}</strong><br>
                            <span class="prof-tag">${profFinal}</span>
                         </td>`;
            });
            html += `</tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
        btnDownload.disabled = false;
        save();
    }

    function save() {
        localStorage.setItem('esetec_last_plan', container.innerHTML);
        localStorage.setItem('esetec_notes', notes.innerHTML);
    }

    document.getElementById('btnGenerate').addEventListener('click', generate);
    document.getElementById('btnDownload').addEventListener('click', () => window.print());
    document.getElementById('btnTheme').addEventListener('click', () => document.body.classList.toggle('dark-mode'));
    document.getElementById('btnReset').addEventListener('click', () => {
        if(confirm("Tout effacer ?")) { localStorage.clear(); location.reload(); }
    });

    updateProfList();
});
