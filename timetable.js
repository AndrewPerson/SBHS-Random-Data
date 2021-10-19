const { Resource, Grade } = require("./shared");
const { Classes, Timetable } = require("./dailytimetable");

module.exports = async () => {
    var bells = await Resource("bells");
    var grade = Grade();
    var classes = Classes(grade).classes;

    return {
        days: {
            "1": Timetable(classes, bells, grade),
            "2": Timetable(classes, bells, grade),
            "3": Timetable(classes, bells, grade),
            "4": Timetable(classes, bells, grade),
            "5": Timetable(classes, bells, grade),
            "6": Timetable(classes, bells, grade),
            "7": Timetable(classes, bells, grade),
            "8": Timetable(classes, bells, grade),
            "9": Timetable(classes, bells, grade),
            "10": Timetable(classes, bells, grade),
            "11": Timetable(classes, bells, grade),
            "12": Timetable(classes, bells, grade),
            "13": Timetable(classes, bells, grade),
            "14": Timetable(classes, bells, grade),
            "15": Timetable(classes, bells, grade)
        }
    }
}