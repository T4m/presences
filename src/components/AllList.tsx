import type {Coach, Eleve} from "../types.ts";
import { useNavigate } from 'react-router-dom';
import {compareElements, fullName} from "../utils.ts";

interface Props {
    elements: Eleve[] | Coach[];
    isCoachMode: Boolean;
}

const AllList: React.FC<Props> = ({ elements, isCoachMode })=> {
    const navigate = useNavigate();
    return (
        <div className={"state-list"}>
            <ul>
                {elements.sort(compareElements).map((item, index) => (
                    <li key={item.id} style={{
                        backgroundColor: (index % 2 === 0) ? "#f3f3f3" : "#e1e1e1"
                    }}>
                        <span>{fullName(item)}</span>
                        {!isCoachMode && (
                            <button
                                aria-label={`Supprimer ${fullName(item)}`}
                                type="button"
                                onClick={() => navigate(`/edit/${item.id}`)}
                            >
                                &#9998;
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllList;