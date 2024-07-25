import { Bells, Grade, getBells, getGrade } from "./shared.js";
import { Classes, getClasses, getTimetable as getDayTimetable } from "./dailytimetable.js";

function getDay(classes: Classes, bells: Bells, grade: Grade) {
    const day = getDayTimetable(classes, bells, grade);

    return {
        ...day,
        periods: Object.fromEntries(
            Object.entries(day.periods)
                .filter(([key, _]) => !isNaN(parseInt(key)))
        )
    };
}

export async function getTimetable(date: Date, msOffset: number) {
    const { bells } = await getBells(date, msOffset);
    const grade = getGrade();
    const classes = getClasses(grade).classes;

    return {
        days: {
            "1": getDay(classes, bells, grade),
            "2": getDay(classes, bells, grade),
            "3": getDay(classes, bells, grade),
            "4": getDay(classes, bells, grade),
            "5": getDay(classes, bells, grade),
            "6": getDay(classes, bells, grade),
            "7": getDay(classes, bells, grade),
            "8": getDay(classes, bells, grade),
            "9": getDay(classes, bells, grade),
            "10": getDay(classes, bells, grade),
            "11": getDay(classes, bells, grade),
            "12": getDay(classes, bells, grade),
            "13": getDay(classes, bells, grade),
            "14": getDay(classes, bells, grade),
            "15": getDay(classes, bells, grade)
        }
    }
}