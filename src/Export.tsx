/* eslint-disable @typescript-eslint/no-explicit-any */
import { backupAll, restoreAll } from "./storage.ts";
import { useState } from 'react';
import {
    handleDownload,
    makeCsvExport,
    makeCsvExportCoachs,
    makeCsvExportIncompleteData,
    toCSVBlob,
    todayStr
} from "./utils.ts";
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

    async function doExport(
        exportFunc: () => Promise<Blob>,
        filename: string,
        initialStatus: string
    ) {
        try {
            setStatus(initialStatus);
            handleDownload(await exportFunc(), filename);
            setStatus("Export réussi.");
        } catch (e: any) {
            setStatus("Erreur : " + e.message);
        }
    }

    const handleBackup = async () => {
        await doExport(
            async () =>
                new Blob(
                    [JSON.stringify(await backupAll(), null, 2)],
                    { type: "application/json;charset=utf-8" }
                ),
            `backup-presences-${todayStr()}.json`,
            "Exporting JSON backup..."
        );
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
        await doExport(
            async () => toCSVBlob(await makeCsvExport()),
            `export-presences-${todayStr()}.csv`,
            "Exporting presences..."
        );
    };

    const handleExportInclomplete = async () => {
        await doExport(
            async () => toCSVBlob(await makeCsvExportIncompleteData()),
            `export-incomplete-data-${todayStr()}.csv`,
            "Exporting incomplete data..."
        );
    }

    const handleExportCoachs = async () => {
        await doExport(
            async () => toCSVBlob(await makeCsvExportCoachs()),
            `export-coachs-${todayStr()}.csv`,
            "Exporting coachs..."
        )
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