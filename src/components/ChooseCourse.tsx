import {CoursEntries} from "../types.ts";
import React from "react";

interface Props {
    selectedCourse: number;
    onCourseSelect: (coursId: number) => void;
}

const ChooseCourse: React.FC<Props> = ({selectedCourse, onCourseSelect}) => {
    return (
        <select
            id="cours"
            className="small"
            value={selectedCourse}
            onChange={(e) => onCourseSelect(Number(e.target.value))}
        >
            {CoursEntries.map((entry, index) => (
                <option key={entry} value={index}>
                    {entry}
                </option>
            ))}
        </select>
    );
}

export default ChooseCourse;