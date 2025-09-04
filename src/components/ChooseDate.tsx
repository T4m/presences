interface Props {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

const ChooseDate: React.FC<Props> = ({selectedDate, onDateSelect}) => {
    return (
        <input
            className="small"
            name="date"
            type="date"
            aria-label="date"
            defaultValue={selectedDate}
            onChange={(e) => onDateSelect(e.target.value)}
        />
    );
}

export default ChooseDate;