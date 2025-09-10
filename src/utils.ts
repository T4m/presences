import {type Eleve, type Coach, CoursEntries} from "./types.ts";
import {getElevesMap, getAllPresences, getAllPresencesCoachs, getAllCoachs, getAllEleves} from "./storage.ts";

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

export async function makeCsvExportIncompleteData(): Promise<string> {
    const eleves = await getAllEleves();
    const columns = [
        "N° PERSONNEL",
        "PRENOM",
        "NOM"
    ]
    const lignes = [columns.join(";")];
    for (const eleve of eleves) {
        if (eleve.number && eleve.nom) continue;
        lignes.push([
            eleve.number || "",
            eleve.prenom,
            eleve.nom || ""
        ].join(";"));
    }
    return lignes.join("\n");
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

export async function makeCsvExportCoachs(): Promise<string> {
    const presences = await getAllPresencesCoachs();
    const coachs = await getAllCoachs();
    const colonnes = [
        "DATE",
        "COURS",
        ...coachs.map(coach => coach.prenom)
    ];
    const lignes = [colonnes];
    const total = new Array(coachs.length).fill(0);

    // Lignes : 1 par date_cours
    for (const key of Object.keys(presences)) {
        const [date, cours] = key.split("_", 2);
        const coursLabel = CoursEntries[Number(cours)];
        const pres = presences[key];
        // Pour chaque moniteur : 1 si présent, sinon ""
        const ligne = [
            date,
            coursLabel,
            ...coachs.map((coach, idx) => {
                if (pres.includes(coach.id)) {
                    total[idx]++;
                    return "1";
                }
                return "";
            })
        ];
        lignes.push(ligne);
    }
    // Ligne totaux
    lignes.push([
        "Total",
        "",
        ...total.map(v => v ? String(v) : "")
    ]);
    return lignes.map(l => l.join(";")).join("\n");
}

export const handleDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    // Certains navigateurs mobiles ont du mal : fallbacks classiques
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 0);
    // /!\ Delay for revoking the URL after download
    setTimeout(() => URL.revokeObjectURL(url), 1500);
};