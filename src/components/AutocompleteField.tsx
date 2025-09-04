import { useCombobox } from 'downshift'
import type {Eleve, Coach} from "../types.ts";
import {useState} from "react";
import {compareElements} from "../utils.ts";

interface Props {
    elements: Eleve[] | Coach[];
    onCreateElement: (prenom: string, nom: string) => Promise<Eleve>;
    onCreatePresence: (eleve: Eleve) => Promise<void>;
    presences: Eleve[];
}

const AutocompleteField: React.FC<Props> = ({ elements, onCreateElement, onCreatePresence, presences })=> {
    const [inputValue, setInputValue] = useState('');

    const filteredEleves = elements.filter(item => {
        if (item && item.prenom) {
            return (
                (! presences.some(p => p.id === item.id)) &&
                item.prenom.toLowerCase().startsWith(inputValue.toLowerCase())
            )
        }
        return false;
    }).sort(compareElements);

    const showCreate = inputValue !== '' && !filteredEleves.some(e => e.prenom.toLowerCase() === inputValue.toLowerCase());
    const inputArray = inputValue.split(" ", 1)
    const newEleve = { prenom: inputArray[0], nom: inputValue.slice(inputArray[0].length).trim() }

    const {
        isOpen,
        getMenuProps,
        getInputProps,
        getItemProps,
    } = useCombobox<Eleve | { prenom: string, nom: string }>({
        items: showCreate ? [...filteredEleves, newEleve] : filteredEleves,
        itemToString: (item) => (item ? ('prenom' in item ? item.prenom : '') : ''),
        onSelectedItemChange: async ({ selectedItem }) => {
            if (selectedItem) {
                let eleve;
                if ('id' in selectedItem) {
                    eleve = selectedItem
                } else {
                    eleve = await onCreateElement(selectedItem["prenom"], selectedItem["nom"]);
                }
                await onCreatePresence(eleve);
                setInputValue('');
            }
        },
        inputValue,
        onInputValueChange: ({ inputValue: newValue }) => {
            setInputValue(newValue || '');
        },
    });

    return (
        <div className={"autocomplete"}>
            <input
                placeholder="prenom nom"
                {...getInputProps()}
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', margin: '0' }}
            />
            <ul {...getMenuProps()} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {isOpen &&
                    (showCreate ? [...filteredEleves, newEleve] : filteredEleves).map((item, index) => (
                        <li
                            key={'id' in item ? item.id : 'create'}
                            {...getItemProps({ item, index })}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#d6ccff' : 'white',
                                cursor: 'pointer',
                                padding: '0.25rem 0.5rem',
                                color: '#000'
                            }}
                        >
                            {'id' in item
                                ? (`${item.prenom} ` + ('nom' in item ? `${item.nom || ''}` : ``))
                                : `+ Ajouter "${item.prenom} ${item.nom}"`}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default AutocompleteField;