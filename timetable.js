const { Resource } = require("./shared");
const { Grade, Classes, Timetable } = require("./dailytimetable");

async function Day() {
    var bells = await Resource("bells");

    var grade = Grade(bells);
    var classes = Classes(grade);

    return Timetable(classes.classes, bells, grade);
}

module.exports = async () => {
    return {
        days: {
            "1": await Day(),
            "2": await Day(),
            "3": await Day(),
            "4": await Day(),
            "5": await Day(),
            "6": await Day(),
            "7": await Day(),
            "8": await Day(),
            "9": await Day(),
            "10": await Day(),
            "11": await Day(),
            "12": await Day(),
            "13": await Day(),
            "14": await Day(),
            "15": await Day()
        }
    }
}