import {type Eleve, type Coach, CoursEntries} from "./types.ts";
import {getElevesMap, getAllPresences} from "./storage.ts";

// Compare two Eleve objects by prenom then nom, case-insensitive
export function compareElements(a: Eleve|Coach, b: Eleve|Coach): number {
    const prenomCompare = a.prenom.localeCompare(b.prenom, undefined, { sensitivity: 'base' });
    if (prenomCompare !== 0) return prenomCompare;
    if ("nom" in a && "nom" in b) {
        return (a.nom || '').localeCompare(b.nom || '', undefined, { sensitivity: 'base' });
    }
    return 0;
}

export const fullName = (item: Eleve | Coach) => {
    return `${item.prenom} ${"nom" in item ? String(item.nom) : ""}`;
}

export async function makeCsvExport(): Promise<string> {
    const presences = await getAllPresences();
    const eleves = await getElevesMap();
    const colonnes = [
        "N° PERSONNEL",
        "FONCTION",
        "DATE",
        "TYPE D'ACTIVITE",
        "HEURE",
        "DURÉE",
        "LIEU"
    ];
    const lignes = [colonnes.join(";")];

    for (const key of Object.keys(presences)) {
        const ids = presences[key];
        // Extraire la date et le nom du cours à partir de la clé
        const [date, coursId] = key.split("_", 2);
        const hour = CoursEntries[Number(coursId)].split(" ")[1];

        for (const eleveId of ids) {
            const eleve = eleves[Number(eleveId)];
            const number = eleve?.number || `${eleve?.prenom || ""} ${eleve?.nom || ""}`.trim();

            lignes.push([
                number,
                "Participant/e",
                date,
                "Entraînement",
                hour,
                "",
                ""
            ].join(";"));
        }
    }
    return lignes.join("\n");
}
