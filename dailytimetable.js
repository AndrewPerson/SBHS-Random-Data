import { Random, Choice, ShouldDo, Letter, Room, Grade, Resource } from "./shared.js";
import { LoremIpsum } from "lorem-ipsum";

const nameGenerator = new LoremIpsum();

function Teacher() {
    var name = nameGenerator.generateWords(1);

    name = name[0].toUpperCase() + name.substring(1);

    var index1 = Random(0, name.length - 2);
    var index2 = Random(index1 + 1, name.length - 1);

    return {
        title: `${Choice("Mr", "Ms")} ${Letter().toUpperCase()} ${name}`,
        surname: name,
        code: name[index1].toUpperCase() + name[index2].toUpperCase()
    };
}

function Class(grade) {
    var name = nameGenerator.generateWords(1);
    name = name[0].toUpperCase() + name.substring(1);
    
    var suffix = ShouldDo() ? Random(1, 5) : Choice("A", "B", "C");

    var code = `${name[0]}${name.substring(1, 3)}`;

    var teacher = Teacher();

    return {
        key: `${grade.year}${code} ${suffix}`,
        timetableClass: {
            title: `${grade.year} ${name} ${suffix}`,
            shortTitle: `${code} ${suffix}`,
            teacher: teacher.code,
            subject: name,
            fullTeacher: teacher.title,
            year: grade.year
        }
    };
}

function Classes(grade) {
    var year = `${Random(0, 9)}${Random(0, 9)}`;

    var baseClasses = {};

    baseClasses[`${grade.year}${year}`] = {
        title: `20${year}`,
        shortTitle: year,
        teacher: "",
        subject: "",
        fullTeacher: "",
        year: grade.year
    };

    baseClasses[`${grade.year}${grade.house}`] = {
        title: `${grade.year}${grade.house}`,
        shortTitle: grade.house,
        teacher: "",
        subject: "",
        fullTeacher: "",
        year: grade.year
    };

    baseClasses[`${grade.year}Y${grade.year}`] = {
        title: `All Year ${grade.year}`,
        shortTitle: `Y${grade.year}`,
        teacher: "",
        subject: "",
        fullTeacher: "",
        year: grade.year
    };

    var studentAdviser = Teacher();
    baseClasses[`${grade.year}SAR`] = {
        title: "Student Adviser",
        shortTitle: "SAR",
        teacher: studentAdviser.code,
        subject: "",
        fullTeacher: studentAdviser.title,
        year: grade.year
    };

    var classes = {};

    for (var i = 0; i < Random(9, 12); i++) {
        var {key, timetableClass} = Class(grade);

        classes[key] = timetableClass;
    }

    return {
        baseClasses,
        classes
    };
}

function Routine(bells) {
    var routine = "";

    for (var i = 0; i < bells.bells.length - 1; i++) {
        var bell = bells.bells[i];

        if (bell.bell.startsWith("Lunch")
            || bell.bell.startsWith("Recess")
            || bell.bell == "End of Day") {
            if (routine.length > 0 && routine[routine.length - 1] != "=") routine += "=";
        }
        else
            routine += bell.bell[0].toUpperCase();
    }

    return routine;
}

function Period(classes) {
    var c = classes[Choice(...Object.keys(classes))];

    return {
        title: c.shortTitle,
        teacher: c.teacher,
        room: Room(),
        fullTeacher: c.fullTeacher,
        year: c.year
    };
}

function Periods(classes, rollCall) {
    return {
        0: Period(classes),
        1: Period(classes),
        2: Period(classes),
        3: Period(classes),
        4: Period(classes),
        5: Period(classes),
        R: rollCall
    };
}

function Timetable(classes, bells, grade) {
    var day = `${bells.day} ${bells.weekType}`;

    var routine = Routine(bells);

    var rollCall = {
        title: `${grade.year < 10 ? `0${grade.year}` : grade.year}${grade.house}`,
        teacher: `${Letter().toUpperCase()}${Letter().toUpperCase()}`,
        room: ""
    };

    return {
        dayname: day,
        routine: routine,
        rollcall: rollCall,
        periods: Periods(classes, rollCall, grade)
    };
}

function RoomVariations(periods, grade) {
    /*
        For some weird reason, if
        there are no room variations,
        the SBHS API returns an empty
        array instead of an object.
    */
    if (ShouldDo()) return [];

    var result = {};

    var available = ["1", "2", "3", "4", "5"];
    for (var i = 0; i < Random(1, 5); i++) {
        var index = Random(0, available.length - 1);
        var choice = available.splice(index, 1)[0];

        result[choice] = {
            period: choice,
            year: grade.year,
            title: periods[choice].title,
            roomFrom: periods[choice].room,
            roomTo: Room()
        };
    }

    return result;
}

function ClassVariations(periods, grade) {
    /*
        For some weird reason, if
        there are no class variations,
        the SBHS API returns an empty
        array instead of an object.
    */
    if (ShouldDo()) return [];

    var result = {};

    var available = ["1", "2", "3", "4", "5"];
    for (var i = 0; i < Random(1, 5); i++) {
        var index = Random(0, available.length - 1);
        var choice = available.splice(index, 1)[0];

        if (ShouldDo()) {
            var teacher = Teacher();

            result[choice] = {
                period: choice,
                year: grade.year,
                title: periods[choice].title,
                teacher: periods[choice].teacher,
                type: "replacement",
                casual: teacher.code,
                casualSurname: teacher.surname
            };
        }
        else
            result[choice] = {
                period: choice,
                year: grade.year,
                title: periods[choice].title,
                teacher: periods[choice].teacher,
                type: "nocover",
                casual: "",
                casualSurname: ""
            };
    }

    return result;
}

function FormattedDate() {
    var now = new Date();
    //Move timezone to Australia
    now.setHours(now.getHours() + 10);

    //End of school day
    if ((now.getHours() == 14 && now.getMinutes() >= 15) || now.getHours() > 14) {
        now.setHours(now.getHours() + 24);
    }

    var year = now.getFullYear().toString();
    var month = (now.getMonth() + 1).toString().padStart(2, "0");
    var day = now.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function FormattedBells(bells, day, weekType) {
    for (var bell of bells) {
        if (bell.bell == "Roll Call") {
            bell.bellDisplay = "Roll Call";
            bell.bell = "R";
        }
        else if (bell.bell.length == 1 && /\d/.test(bell.bell)) {
            bell.bellDisplay = `Period ${bell.bell}`;
        }
        else {
            bell.bellDisplay = bell.bell;
        }

        bell.reason = "";
        bell.reasonShort = `${day} ${weekType}`;
    }

    return bells;
}

export default async () => {
    var bells = await Resource("bells");
    var grade = Grade();
    var classes = Classes(grade);
    var timetable = Timetable(classes.classes, bells, grade);
    var roomVariations = RoomVariations(timetable.periods, grade);
    var classVariations = ClassVariations(timetable.periods, grade);

    return {
        bells: FormattedBells(bells.bells, bells.day, bells.weekType),
        date: FormattedDate(),
        status: "OK",
        serverTimezone: "39600",
        shouldDisplayVariations: true,
        timetable: {
            subjects: {...classes.classes, ...classes.baseClasses},
            timetable: timetable
        },
        classVariations: classVariations,
        roomVariations: roomVariations
    };
}

export { Classes, Timetable };