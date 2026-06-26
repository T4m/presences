import type {Eleve, Coach} from "../types.ts";
import {compareElements, fullName} from "../utils.ts";

interface Props {
    elements: Eleve[] | Coach[];
    onRemovePresence: (eleveId: string) => void;
}

const CurrentList: React.FC<Props> = ({ elements, onRemovePresence })=> {
    return (
        <div className={"state-list state-list--current"}>
            <ul>
                {elements.sort(compareElements).map((item, index) => (
                    <li key={item.id} style={{
                        backgroundColor: index % 2 === 0 ? '#ebfff1' : '#b6ddbe',
                    }} className={"row"}>
                        <div className={"col-xs-10"}>{fullName(item)}</div>
                        <div className={"col-xs-2"}>
                            <button
                                aria-label={`Supprimer ${fullName(item)}`}
                                type="button"
                                onClick={() => onRemovePresence(item.id)}
                            >
                                &times;
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrentList;