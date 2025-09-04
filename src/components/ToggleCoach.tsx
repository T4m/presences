const ToggleCoach = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
    return (
        <fieldset className="center-wrapper">
            <label>
                Élèves &nbsp;
                <input
                    name="mode"
                    type="checkbox"
                    role="switch"
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                /> Coachs
            </label>
        </fieldset>
    );
};

export default ToggleCoach;