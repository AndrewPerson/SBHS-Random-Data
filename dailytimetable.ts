import { randomInt, choice, shouldDo, getLetter, getRoom, getGrade, getBells, Grade, Bells, choices, Bell as RawBell, formatDate } from "./shared.js";
import { LoremIpsum } from "lorem-ipsum";

const nameGenerator = new LoremIpsum();

export type Classes = {
    [key: string]: Class
}

export type Class = {
    title: string,
    shortTitle: string,
    teacher: string,
    subject: string,
    fullTeacher: string,
    year: string
}

export type Period = {
    title: string,
    teacher: string,
    room: string,
    fullTeacher: string,
    year: string
}

export type Periods = {
    [key: string]: Period | RollCall,
}

export type RollCall = {
    title: string,
    teacher: string,
    room: string
}

export type RoomVariations = RoomVariation[] | {
    [key: string]: RoomVariation
}

export type RoomVariation = {
    period: string,
    year: string,
    title: string,
    roomFrom: string,
    roomTo: string
}

export type ClassVariations = ClassVariation[] | {
    [key: string]: ClassVariation
}

export type ClassVariation = {
    period: string,
    year: string,
    title: string,
    teacher: string,
    type: string,
    casual: string,
    casualSurname: string
}

export type Bell = RawBell & {
    bellDisplay: string;
    reason: string;
    reasonShort: string;
}

export function getTeacher() {
    let name = nameGenerator.generateWords(1);

    name = name[0].toUpperCase() + name.substring(1);

    const index1 = randomInt(0, name.length - 2);
    const index2 = randomInt(index1 + 1, name.length - 1);

    return {
        title: `${choice("Mr", "Ms")} ${getLetter().toUpperCase()} ${name}`,
        surname: name,
        code: name[index1].toUpperCase() + name[index2].toUpperCase()
    };
}

export function getClass(grade: Grade): { key: string, timetableClass: Class } {
    let name = nameGenerator.generateWords(1);
    name = name[0].toUpperCase() + name.substring(1);
    
    const suffix = shouldDo() ? randomInt(1, 5) : choice("A", "B", "C");

    const code = `${name[0]}${name.substring(1, 3)}`;

    const teacher = getTeacher();

    return {
        key: `${grade.year}${code} ${suffix}`,
        timetableClass: {
            title: `${grade.year} ${name} ${suffix}`,
            shortTitle: `${code} ${suffix}`,
            teacher: teacher.code,
            subject: name,
            fullTeacher: teacher.title,
            year: grade.year.toString()
        }
    };
}

export function getClasses(grade: Grade): { classes: Classes, miscClasses: Classes } {
    const year = `${randomInt(0, 9)}${randomInt(0, 9)}`;

    const classes: Classes = {};

    for (let i = 0; i < randomInt(9, 12); i++) {
        const { key, timetableClass } = getClass(grade);

        classes[key] = timetableClass;
    }

    const miscClasses: Classes = {};

    miscClasses[`${grade.year}${year}`] = {
        title: `20${year}`,
        shortTitle: year,
        teacher: "",
        subject: "",
        fullTeacher: "",
        year: grade.year.toString()
    };

    miscClasses[`${grade.year}${grade.house}`] = {
        title: `${grade.year}${grade.house}`,
        shortTitle: grade.house,
        teacher: "",
        subject: "",
        fullTeacher: "",
        year: grade.year.toString()
    };

    miscClasses[`${grade.year}Y${grade.year}`] = {
        title: `All Year ${grade.year}`,
        shortTitle: `Y${grade.year}`,
        teacher: "",
        subject: "",
        fullTeacher: "",
        year: grade.year.toString()
    };

    const studentAdviser = getTeacher();
    miscClasses[`${grade.year}SAR`] = {
        title: "Student Adviser",
        shortTitle: "SAR",
        teacher: studentAdviser.code,
        subject: "",
        fullTeacher: studentAdviser.title,
        year: grade.year.toString()
    };


    return {
        classes,
        miscClasses
    };
}

export function getRoutine(bells: Bells) {
    let routine = "";

    for (let i = 0; i < bells.bells.length - 1; i++) {
        const bell = bells.bells[i];

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

export function getPeriod(classes: Classes): Period {
    const c = classes[choice(...Object.keys(classes))];

    return {
        title: c.shortTitle,
        teacher: c.teacher,
        room: getRoom(),
        fullTeacher: c.fullTeacher,
        year: c.year
    };
}

export function getPeriods(classes: Classes, rollCall: RollCall): Periods {
    return {
        0: getPeriod(classes),
        1: getPeriod(classes),
        2: getPeriod(classes),
        3: getPeriod(classes),
        4: getPeriod(classes),
        5: getPeriod(classes),
        R: rollCall
    };
}

export function getTimetable(classes: Classes, bells: Bells, grade: Grade) {
    const day = `${bells.day} ${bells.weekType}`;

    const routine = getRoutine(bells);

    const rollCall = {
        title: `${grade.year < 10 ? `0${grade.year}` : grade.year}${grade.house}`,
        teacher: `${getLetter().toUpperCase()}${getLetter().toUpperCase()}`,
        room: ""
    };

    return {
        dayname: day,
        dayNumber: bells.dayNumber.toString(),
        routine: routine,
        rollcall: rollCall,
        periods: getPeriods(classes, rollCall)
    };
}

export function getRoomVariations(periods: Periods, grade: Grade): RoomVariations {
    /*
        For some weird reason, if
        there are no room variations,
        the SBHS API returns an empty
        array instead of an object.
    */
    if (shouldDo()) return [];

    return Object.fromEntries(
        choices(randomInt(1, 5), ...Object.entries(periods)).map(([periodName, period]) => {
            return [periodName, {
                period: periodName,
                year: grade.year.toString(),
                title: period.title,
                roomFrom: period.room,
                roomTo: getRoom()
            }];
        })
    );
}

export function getClassVariations(periods: Periods, grade: Grade): ClassVariations {
    /*
        For some weird reason, if
        there are no class variations,
        the SBHS API returns an empty
        array instead of an object.
    */
    if (shouldDo()) return [];

    return Object.fromEntries(
        choices(randomInt(1, 5), ...Object.entries(periods)).map(([periodName, period]) => {
            if (shouldDo(0.7)) {
                const casual = getTeacher();

                return [periodName, {
                    period: periodName,
                    year: grade.year,
                    title: period.title,
                    teacher: period.teacher,
                    type: "replacement",
                    casual: casual.code,
                    casualSurname: casual.surname
                }];
            }
            else {
                return [periodName, {
                    period: periodName,
                    year: grade.year.toString(),
                    title: period.title,
                    teacher: period.teacher,
                    type: "nocover",
                    casual: "",
                    casualSurname: ""
                }];
            }
        })
    );
}

export function getFormattedBells(bells: RawBell[], day: string, weekType: string): Bell[] {
    return bells.map(bell => {
        if (bell.bell == "Roll Call") {
            return {
                ...bell,
                bellDisplay: "Roll Call",
                bell: "R",
                reason: "",
                reasonShort: `${day} ${weekType}`
            }
        }
        else if (bell.bell.length == 1 && /\d/.test(bell.bell)) {
            return {
                ...bell,
                bellDisplay: `Period ${bell.bell}`,
                reason: "",
                reasonShort: `${day} ${weekType}`
            }
        }
        else {
            return {
                ...bell,
                bellDisplay: bell.bell,
                reason: "",
                reasonShort: `${day} ${weekType}`
            }
        }
    });
}

export async function getDailyTimetable(date: Date, msOffset: number) {
    const result = await getBells(date, msOffset);

    const grade = getGrade();
    const classes = getClasses(grade);
    const timetable = getTimetable(classes.classes, result.bells, grade);
    const roomVariations = getRoomVariations(timetable.periods, grade);
    const classVariations = getClassVariations(timetable.periods, grade);

    return {
        bells: getFormattedBells(result.bells.bells, result.bells.day, result.bells.weekType),
        date: formatDate(result.date),
        status: "OK",
        serverTimezone: "39600",
        shouldDisplayVariations: true,
        timetable: {
            subjects: { ...classes.classes, ...classes.miscClasses },
            timetable: timetable
        },
        classVariations: classVariations,
        roomVariations: roomVariations
    };
}
