import {type Coach, CoursEntries, type Eleve, type EleveWithQty} from "../types.ts";
import { useNavigate } from 'react-router-dom';
import {compareElements, fullName} from "../utils.ts";
import {useMemo, useState} from "react";

interface Props {
    elements: EleveWithQty[] | Coach[];
    isCoachMode: boolean;
}

const AllList: React.FC<Props> = ({ elements, isCoachMode })=> {

    enum Sort {
        NAME,
        COURS,
        PRESENCE,
        WARNING,
    }

    const navigate = useNavigate();
    const getCoursName = (coursId: number | undefined): string =>
        (CoursEntries[coursId ?? 0]).replace(" ", "").split(":")[0];

    const [currentSort, setCurrentSort] = useState(Sort.NAME);

    const sortedElements = useMemo(() => {
        const copy = [...elements];

        copy.sort((a, b) => {
            if (currentSort === Sort.NAME) {
                return compareElements(a, b);
            }

            if (!isCoachMode && currentSort === Sort.COURS) {
                const byCours = getCoursName((a as Eleve).coursId).localeCompare(
                    getCoursName((b as Eleve).coursId)
                );
                if (byCours !== 0) return byCours;
                return compareElements(a, b);
            }

            if (currentSort === Sort.PRESENCE) {
                return (a as EleveWithQty).qty - (b as EleveWithQty).qty;
            }

            return 0;
        });

        return copy;
    }, [elements, currentSort, isCoachMode]);

    return (
        <div className={"state-list"}>
            <ul>
                <li className={"row small nowrap"} >
                    <a className={"col-xs-7 list-header"} onClick={() => setCurrentSort(Sort.NAME)}>Nom▼</a>
                    <a className={"col-xs-2 list-header"} onClick={() => setCurrentSort(Sort.COURS)}>C▼</a>
                    <a className={"col-xs-1 list-header"} onClick={() => setCurrentSort(Sort.PRESENCE)}>P▼</a>
                    <a className={"col-xs-1 list-header"} onClick={() => setCurrentSort(Sort.WARNING)}>W▼</a>
                    <div className={"col-xs-1 list-header"}>E</div>
                </li>
                {sortedElements.map((item, index) => (
                    <li key={item.id} style={{
                        backgroundColor: (index % 2 === 0) ? "#f3f3f3" : "#e1e1e1"
                    }} className={"state-item row"}>
                        <div className={"state-item--name col-xs-7"}>{fullName(item)}</div>
                        {!isCoachMode && (
                            <>
                                <div className={"state-item--cours col-xs-2"}>{getCoursName((item as Eleve).coursId)}</div>
                                <div className={"state-item--qty col-xs-1"}>{(item as EleveWithQty).qty}</div>
                                <div className="warning col-xs-1">
                                    {(!("number" in item) || !item.number) && (
                                        <span
                                            aria-label="Warning: missing number"
                                            title="N°PERSONNEL non défini"
                                        >&#9888;</span>
                                    )}
                                </div>
                                <div className={"col-xs-1"}>
                                    <button
                                        aria-label={`Éditer ${fullName(item)}`}
                                        type="button"
                                        onClick={() => navigate(`/edit/${item.id}`)}
                                    >
                                        &#9998;
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllList;