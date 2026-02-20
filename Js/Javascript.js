function generate() {

    const filiere = document.getElementById('filiere-select').value;
    const niveau = document.getElementById('niveau-select').value;
    const matieresFiliere = ecoleData[filiere];

    if (!matieresFiliere) {
        alert("Sélectionnez une filière !");
        return;
    }

    const hours = ["08h - 09h", "09h - 10h", "10h20 - 12h", "13h - 14h", "14h - 15h", "15h - 16h", "16h - 17h"];
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

    let planning = {};
    let profHeuresJour = {};
    let totalHours = 0;

    // Initialisation
    days.forEach(day => {
        planning[day] = {};
        hours.forEach(hour => {
            planning[day][hour] = null;
        });
    });

    profs.forEach(prof => {
        profHeuresJour[prof.name] = {};
        days.forEach(day => {
            profHeuresJour[prof.name][day] = 0;
        });
    });

    // ALGORITHME INTELLIGENT
    days.forEach(day => {

        hours.forEach(hour => {

            const profDisponible = profs.find(prof => {

                const enseigneFiliere = prof.specialites.some(s =>
                    matieresFiliere.some(m => m.toLowerCase() === s.toLowerCase())
                );

                const dispoJour = prof.dispos.includes(day);
                const limiteHeures = profHeuresJour[prof.name][day] < 4;

                return enseigneFiliere && dispoJour && limiteHeures;
            });

            if (profDisponible) {

                const matieresValides = profDisponible.specialites.filter(s =>
                    matieresFiliere.some(m => m.toLowerCase() === s.toLowerCase())
                );

                const index = profHeuresJour[profDisponible.name][day] % matieresValides.length;
                const matiere = matieresValides[index];

                planning[day][hour] = {
                    matiere: matiere,
                    prof: profDisponible.name
                };

                profHeuresJour[profDisponible.name][day]++;
                totalHours++;
            }

        });

    });

    // Génération HTML
    let html = `<table><thead><tr><th>HEURE</th>${days.map(d => `<th>${d.toUpperCase()}</th>`).join('')}</tr></thead><tbody>`;

    hours.forEach(hour => {
        html += `<tr><td class="time-slot"><b>${hour}</b></td>`;

        days.forEach(day => {

            if (planning[day][hour]) {
                html += `
                    <td class="cell">
                        <strong>${planning[day][hour].matiere}</strong><br>
                        <span class="prof-tag">${planning[day][hour].prof}</span>
                    </td>
                `;
            } else {
                html += `<td class="cell" style="background:#f4f4f4;">Libre</td>`;
            }

        });

        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

    // Mise à jour affichage stats
    document.getElementById('display-filiere').textContent = filiere;
    document.getElementById('display-niveau').textContent = niveau;
    document.getElementById('total-hours').textContent = totalHours + "h";

    // Activer bouton PDF
    document.getElementById('btnDownload').disabled = false;
}
