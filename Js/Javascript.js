document.addEventListener('DOMContentLoaded', () => {
    // --- SÉLECTEURS ---
    const container = document.getElementById('schedule-container');
    const notes = document.getElementById('notes-content');
    const btnDownload = document.getElementById('btnDownload');
    const statHours = document.getElementById('total-hours');
    const statSubjects = document.getElementById('stat-subjects');
    const statConflicts = document.getElementById('conflict-count');

    // --- DONNÉES ET RESSOURCES ---
    let ressources = {
        profs: JSON.parse(localStorage.getItem('loh_profs')) || [],
        salles: JSON.parse(localStorage.getItem('loh_rooms')) || []
    };

    // --- INITIALISATION ---
    updateResourceUI();
    loadSavedData();

    // --- FONCTIONS DE CONFIGURATION (PROFS/SALLES) ---
    window.ajouterProf = function() {
        const name = document.getElementById('prof-name').value.trim();
        const matiere = document.getElementById('prof-matiere').value;
        
        if (name === "") return alert("Veuillez saisir un nom");
        
        ressources.profs.push({ name, matiere });
        saveRessources();
        updateResourceUI();
        document.getElementById('prof-name').value = "";
    };

    window.ajouterSalle = function() {
        const name = document.getElementById('room-name').value.trim();
        if (name === "") return alert("Veuillez saisir un nom de salle");
        
        ressources.salles.push(name);
        saveRessources();
        updateResourceUI();
        document.getElementById('room-name').value = "";
    };

    function updateResourceUI() {
        const listProfs = document.getElementById('list-profs');
        const listRooms = document.getElementById('list-rooms');
        
        listProfs.innerHTML = ressources.profs.map(p => `<li><i class="fas fa-user-check"></i> ${p.name} (${p.matiere})</li>`).join('');
        listRooms.innerHTML = ressources.salles.map(s => `<li><i class="fas fa-chalkboard"></i> ${s}</li>`).join('');
    }

    function saveRessources() {
        localStorage.setItem('loh_profs', JSON.stringify(ressources.profs));
        localStorage.setItem('loh_rooms', JSON.stringify(ressources.salles));
    }

    // --- GÉNÉRATION DU PLANNING ---
    function generate() {
        if (ressources.profs.length === 0) {
            return alert("⚠️ Ajoutez au moins un professeur avant de générer !");
        }

        const hours = ["08h-10h", "10h-12h", "12h-14h", "14h-16h", "16h-18h"];
        const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
        
        let html = `<table><thead><tr><th>Heure</th>${days.map(d => `<th>${d}</th>`).join('')}</tr></thead><tbody>`;

        hours.forEach(time => {
            html += `<tr><td class="time-slot"><b>${time}</b></td>`;
            
            days.forEach(() => {
                if (time === "12h-14h") {
                    html += `<td class="pause-cell">PAUSE</td>`;
                } else {
                    // Sélection aléatoire intelligente
                    const randomProf = ressources.profs[Math.floor(Math.random() * ressources.profs.length)];
                    const randomRoom = ressources.salles.length > 0 
                        ? ressources.salles[Math.floor(Math.random() * ressources.salles.length)] 
                        : "S. par déf.";

                    html += `
                        <td contenteditable="true" class="cell">
                            <div class="cell-content">
                                <strong>${randomProf.matiere}</strong>
                                <span class="prof-tag">${randomProf.name}</span>
                                <small>${randomRoom}</small>
                            </div>
                        </td>`;
                }
            });
            html += `</tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
        btnDownload.disabled = false;
        
        updateStats();
        saveAll();
    }

    // --- STATISTIQUES EN TEMPS RÉEL ---
    function updateStats() {
        const cells = document.querySelectorAll('.cell strong');
        const subjects = new Set();
        cells.forEach(c => subjects.add(c.textContent));

        statHours.innerText = (cells.length * 2) + "h";
        statSubjects.innerText = subjects.size;
        
        // Simulation de détection de conflit (optionnel)
        statConflicts.innerText = "0"; 
    }

    // --- PERSISTENCE ---
    function saveAll() {
        localStorage.setItem('loh_data', container.innerHTML);
        localStorage.setItem('loh_notes', notes.innerHTML);
    }

    function loadSavedData() {
        const savedData = localStorage.getItem('loh_data');
        const savedNotes = localStorage.getItem('loh_notes');
        
        if (savedData) {
            container.innerHTML = savedData;
            btnDownload.disabled = false;
            updateStats();
        }
        if (savedNotes) {
            notes.innerHTML = savedNotes;
        }
    }

    // --- ÉVÉNEMENTS ---
    document.getElementById('btnGenerate').addEventListener('click', generate);
    
    document.getElementById('btnReset').addEventListener('click', () => {
        if(confirm("Voulez-vous vraiment tout effacer ?")) {
            localStorage.clear();
            location.reload();
        }
    });

    document.getElementById('btnDownload').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('btnTheme').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        document.getElementById('btnTheme').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Sauvegarde auto lors de la modification manuelle des cellules
    container.addEventListener('input', () => {
        updateStats();
        saveAll();
    });
    
    notes.addEventListener('input', saveAll);
});