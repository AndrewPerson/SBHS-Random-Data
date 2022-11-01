import { Resource, Grade } from "./shared.js";
import { Classes, Timetable } from "./dailytimetable.js";

function Day(classes, bells, grade) {
    let day = Timetable(classes, bells, grade);

    let keys = Object.keys(day.periods).filter(key => !isNaN(parseInt(key)));

    let newPeriods = {};

    for (let key of keys) {
        newPeriods[key] = day.periods[key];
    }

    day.periods = newPeriods;

    return day;
}

export default async () => {
    var bells = await Resource("bells");
    var grade = Grade();
    var classes = Classes(grade).classes;

    return {
        days: {
            "1": Day(classes, bells, grade),
            "2": Day(classes, bells, grade),
            "3": Day(classes, bells, grade),
            "4": Day(classes, bells, grade),
            "5": Day(classes, bells, grade),
            "6": Day(classes, bells, grade),
            "7": Day(classes, bells, grade),
            "8": Day(classes, bells, grade),
            "9": Day(classes, bells, grade),
            "10": Day(classes, bells, grade),
            "11": Day(classes, bells, grade),
            "12": Day(classes, bells, grade),
            "13": Day(classes, bells, grade),
            "14": Day(classes, bells, grade),
            "15": Day(classes, bells, grade)
        }
    }
}