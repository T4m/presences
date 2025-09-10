/* eslint-disable @typescript-eslint/no-explicit-any */
import { backupAll, restoreAll } from "./storage.ts";
import { useState } from 'react';
import {handleDownload, makeCsvExport, makeCsvExportCoachs, makeCsvExportIncompleteData} from "./utils.ts";
import {Link} from "react-router-dom";

export default function Export() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleBackup = async () => {
        setStatus("Création du backup...");
        try {
            const json = await backupAll();
            const today = new Date().toISOString().split("T")[0];
            const filename = `backup-presences-${today}.json`;
            const blob = new Blob([JSON.stringify(json, null, 2)], {type: "application/json"});
            handleDownload(blob, filename);
            setStatus("Backup réussi.");
        } catch (e: any) {
            setStatus("Erreur : " + e.message);
        }
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
        setStatus("Création de l'export...");
        try {
            const csv = await makeCsvExport();
            const today = new Date().toISOString().split("T")[0];
            const filename = `export-presences-${today}.csv`;
            const blob = new Blob([csv], {type: "text/csv"});
            handleDownload(blob, filename);
            setStatus("Export réussi.");
        } catch (e: any) {
            setStatus("Erreur : " + e.message);
        }
    }

    const handleExportInclomplete = async () => {
        setStatus("Création de l'export...");
        try {
            const csv = await makeCsvExportIncompleteData();
            const today = new Date().toISOString().split("T")[0];
            const filename = `export-incomplete-data-${today}.csv`;
            const blob = new Blob([csv], {type: "text/csv"});
            handleDownload(blob, filename);
            setStatus("Export réussi.");
        } catch (e: any) {
            setStatus("Erreur : " + e.message);
        }
    }

    const handleExportCoachs = async () => {
        setStatus("Export coachs...");
        try {
            const csv = await makeCsvExportCoachs();
            const today = new Date().toISOString().split("T")[0];
            const filename = `export-coachs-${today}.csv`;
            const blob = new Blob([csv], {type: "text/csv"});
            handleDownload(blob, filename);
            setStatus("Export réussi.");
        } catch (e: any) {
            setStatus("Erreur : " + e.message);
        }
    }

    return (
        <main>
            <div className="container-fluid">
                <h1>Export</h1>
                <p className="nav-link"><Link to="/">Retour</Link></p>
                {status &&
                    <div className="status-info">{status}</div>
                }
                <button style={{width: "100%", padding: "5px"}} onClick={handleBackup}>Backup</button>
                <hr />
                <input type="file" accept=".json,application/json" onChange={handleFileChange} />
                <button
                    disabled={!selectedFile}
                    style={{width: "100%", padding: "5px"}}
                    onClick={handleRestore}
                >Restore</button>
                <hr />
                <button style={{width: "100%", padding: "5px"}} onClick={handleExport}>CSV Export (BDNS)</button>
                <hr />
                <button style={{width: "100%", padding: "5px"}} onClick={handleExportInclomplete}>Incomplete data</button>
                <hr />
                <button style={{width: "100%", padding: "5px"}} onClick={handleExportCoachs}>Export Coachs</button>
                <hr />
            </div>
        </main>
    );
}