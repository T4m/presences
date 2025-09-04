import React, { useEffect, useState } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { storeEleves } from './storage';
import {type Eleve, type Kyu, KyuEntries} from "./types.ts";
import ChooseCourse from "./components/ChooseCourse.tsx";

const EditEleve: React.FC = () => {
    const { eleveId } = useParams<{ eleveId: string }>();
    const navigate = useNavigate();
    const [eleve, setEleve] = useState<Eleve | null>(null);
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [number, setNumber] = useState('');
    const [coursId, setSelectedCours] = useState<number>(0);

    const [kyus, setKyus] = useState<Kyu[]>(eleve?.kyus || []);
    const [newKyuId, setNewKyuId] = useState<number>(0);
    const [newKyuDate, setNewKyuDate] = useState<string>("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (!eleveId) return;
        const fetchEleve = async () => {
            const data = await storeEleves.getItem<Eleve>(eleveId);
            if (data) {
                setEleve(data);
                setPrenom(data.prenom);
                setNom(data.nom || '');
                setNumber(data.number || '');
                setSelectedCours(data.coursId || 0);
                setKyus(data.kyus || []);
            }
        };
        fetchEleve();
    }, [eleveId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eleve) return;
        const updatedEleve: Eleve = { ...eleve, prenom, nom, number, coursId, kyus };
        await storeEleves.setItem(eleve.id, updatedEleve);
        navigate('/');  // Go back to main page or wherever
    };

    if (!eleve) return <div>Loading...</div>;

    return (
        <main>
            <div className="container-fluid">
                <h1>Édition</h1>
                <p className="nav-link"><Link to="/">Retour</Link></p>
                <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '1rem auto' }}>
                    <label>
                        Prénom
                        <input
                            type="text"
                            value={prenom}
                            onChange={e => setPrenom(e.target.value)}
                            required
                        />
                    </label>

                    <label style={{ marginTop: '1rem', display: 'block' }}>
                        Nom
                        <input
                            type="text"
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            required
                        />
                    </label>

                    <label style={{ marginTop: '1rem', display: 'block' }}>
                        Number
                        <input
                            type="text"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                        />
                    </label>

                    <label style={{ marginTop: '1rem', display: 'block' }}>
                        Cours principal
                        <ChooseCourse selectedCourse={coursId} onCourseSelect={setSelectedCours} />
                    </label>

                    <p>Kyu</p>
                    <ul className="kyu-list small">
                        {kyus.map((kyu, idx) => (
                            <li key={idx} className={`kyu-${kyu.id}`}>
                                {KyuEntries[kyu.id]} - {String(kyu.date)}
                            </li>
                        ))}
                    </ul>

                    <button
                        className="btn-small secondary"
                        onClick={() => setAdding(true)}
                    >Ajouter</button>

                    {adding && (
                        <div>
                            <div className="grid gap-1">
                                <select
                                    value={newKyuId}
                                    className="small"
                                    onChange={(e) => setNewKyuId(Number(e.target.value))}
                                    required
                                >
                                    {KyuEntries.map((kyuNom, index) => (
                                        <option key={index} value={index}>
                                            {kyuNom}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    className="small"
                                    value={newKyuDate}
                                    onChange={(e) => setNewKyuDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <button
                                    className="btn-small secondary"
                                    onClick={() => {
                                        console.log(newKyuId, newKyuDate);
                                        if (!newKyuDate) return alert("Tous les champs sont obligatoires");

                                        if (kyus.find(k => k.id === newKyuId)) {
                                            return alert("Ce passage de ceinture est déjà enregistré.");
                                        }

                                        setKyus([...kyus, { id: newKyuId, date: newKyuDate }]);
                                        setNewKyuId(0);
                                        setNewKyuDate("");
                                        setAdding(false);
                                    }}
                                >
                                    Valider
                                </button>
                                <button
                                    className="btn-small secondary"
                                    onClick={() => setAdding(false)}>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}


                    <button type="submit" style={{ marginTop: '1rem' }}>
                        Enregistrer
                    </button>
                </form>
            </div>
        </main>
    );
};

export default EditEleve;