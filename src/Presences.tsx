import type {Eleve, Coach} from "./types.ts";
import {
    getAllEleves,
    createCoach,
    createEleve,
    createPresence,
    getElevesByCourse,
    removePresence,
    createPresenceCoach, getCoachsByCourse, removePresenceCoach, getAllCoachs
} from "./storage.ts";
import AutocompleteField from "./components/AutocompleteField.tsx";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ToggleCoach from "./components/ToggleCoach.tsx";
import AllList from "./components/AllList.tsx";
import ChooseDate from "./components/ChooseDate.tsx";
import ChooseCourse from "./components/ChooseCourse.tsx";
import CurrentList from "./components/CurrentList.tsx";

const Presences = () => {
    // STATE DEFINITIONS >>>
    const [selectedCourse, setSelectedCours] = useState<number>(0);
    const [isCoachMode, setCoachMode] = useState(false);
    const [eleves, setEleves] = useState<Eleve[]>([]);
    const [moniteurs, setCoachs] = useState<Coach[]>([]);
    const initialDate = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState<string>(initialDate);
    const [presences, setPresences] = useState<Eleve[]>([]);
    const [presencesCoachs, setPresencesCoachs] = useState<Eleve[]>([]);

    // STATE MUTATORS & HANDLERS >>>

    const fetchPresences = async () => {
        await getElevesByCourse(selectedDate, selectedCourse).then((result) => {
            setPresences(result);
        })
    };
    const fetchPresencesCoachs = async () => {
        await getCoachsByCourse(selectedDate, selectedCourse).then((result) => {
            setPresencesCoachs(result);
        })
    };
    const handleRemovePresence = async (eleveId: string) => {
        if (!selectedDate) return;
        const updatedIds = await removePresence(eleveId, selectedDate, selectedCourse);
        setPresences(presences.filter(e => updatedIds.includes(e.id)));
    };
    const handleRemovePresenceCoach = async (coachId: string) => {
        if (!selectedDate) return;
        const updatedIds = await removePresenceCoach(coachId, selectedDate, selectedCourse);
        setPresencesCoachs(presencesCoachs.filter(e => updatedIds.includes(e.id)));
    };

    // Create a single eleve & add its presence
    const onCreateEleve = async (prenom: string, nom?: string) => {
        const newEleve = await createEleve(prenom, nom);
        setEleves((prev) => [...prev, newEleve]);
        return newEleve;
    };

    // Create a single moniteur & add its presence
    const onCreateCoach = async (prenom: string) => {
        const newCoach = await createCoach(prenom);
        setCoachs((prev) => [...prev, newCoach]);
        return newCoach;
    };

    // Create a single presence for an eleve
    const onCreatePresence = async (eleve: Eleve) => {
        await createPresence(eleve.id, selectedDate, selectedCourse);
        await fetchPresences();
    }

    const onCreatePresenceCoach = async (coach: Coach) => {
        await createPresenceCoach(coach.id, selectedDate, selectedCourse);
        await fetchPresencesCoachs();
    }

    // REACTIVE EFFECTS >>>

    // Display current course presences (mount & change)
    useEffect(() => {
        fetchPresences();
        fetchPresencesCoachs();
    }, [selectedDate, selectedCourse]);

    // Display full list on mount
    useEffect(() => {
        const fetchEleves = async () => {
            const data = await getAllEleves();
            setEleves(data);
        };
        fetchEleves();
    }, []);

    // Display full list of Coachs
    useEffect(() => {
        const fetchCoachs = async () => {
            const data = await getAllCoachs();
            setCoachs(data);
        };
        fetchCoachs();
    }, []);

    return (
        <main>
            <div className="container-fluid">
                <h1>Présences</h1>
                <p className="nav-link"><Link to="/export">Export</Link></p>
                <div>
                    <div className="grid">
                        <ChooseDate selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                        <ChooseCourse selectedCourse={selectedCourse} onCourseSelect={setSelectedCours} />
                    </div>
                    <ToggleCoach checked={isCoachMode} onChange={setCoachMode} />
                    <hr className={"mt-0"}/>
                    <AutocompleteField
                        elements={isCoachMode ? moniteurs : eleves}
                        onCreateElement={isCoachMode ? onCreateCoach : onCreateEleve}
                        onCreatePresence={isCoachMode ? onCreatePresenceCoach : onCreatePresence}
                        presences={isCoachMode ? presencesCoachs : presences}
                    />
                    <p style={{marginTop: "1rem"}}>Sélectionnés ({(isCoachMode ? presencesCoachs : presences).length})</p>
                    <CurrentList
                        elements={isCoachMode ? presencesCoachs : presences}
                        onRemovePresence={isCoachMode ? handleRemovePresenceCoach : handleRemovePresence}
                    />
                    <p>Inscrits</p>
                    <AllList elements={isCoachMode ? moniteurs : eleves} isCoachMode={isCoachMode} />
                </div>
            </div>
        </main>
    );
}

export default Presences;
