import { backupAll, restoreAll } from "./storage.ts";
import { useState } from 'react';
import {makeCsvExport} from "./utils.ts";
import {Link} from "react-router-dom";

export default function Export() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleBackup = async () => {
        const json = await backupAll();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "backup-presenceDB.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRestore = async () => {
        if (!selectedFile) {
            alert("Veuillez sélectionner un fichier JSON à restaurer.");
            return;
        }
        const text = await selectedFile.text();
        const json = JSON.parse(text);
        await restoreAll(json);
        alert("Restore done");
    }

    const handleExport = async () => {
        const csv = await makeCsvExport();
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export-presences.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <main>
            <div className="container-fluid">
                <h1>Export</h1>
                <p className="nav-link"><Link to="/">Retour</Link></p>
                <button style={{width: "100%", padding: "5px"}} onClick={handleBackup}>Backup</button>
                <hr />
                <input type="file" accept=".json,application/json" onChange={handleFileChange} />
                <button
                    disabled={!selectedFile}
                    style={{width: "100%", padding: "5px"}}
                    onClick={handleRestore}
                >Restore</button>
                <hr />
                <button style={{width: "100%", padding: "5px"}} onClick={handleExport}>CSV Export</button>
            </div>
        </main>
    );
}