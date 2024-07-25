import { getGrade, randomInt, choice, choices } from "./shared.js";
import { LoremIpsum } from "lorem-ipsum";

const nameGenerator = new LoremIpsum();

type Name = {
    given: string;
    family: string;
}

function getStudentNumber() {
    let result = "";

    for (let i = 0; i < 9; i++)
        result += randomInt(0, 9).toString();

    return result;
}

function getName(): Name {
    var given = nameGenerator.generateWords(1);
    given = given[0].toUpperCase() + given.substring(1);

    var family = nameGenerator.generateWords(1);
    family = family[0].toUpperCase() + family.substring(1);

    return {
        given: given,
        family: family
    };
}

function getEmails(name: Name) {
    const emailEndings = ["@hotmail.com", "@gmail.com", "@outlook.com",
                            "@student.sbhs.nsw.edu.au", "@yahoo.com"];

    return choices(randomInt(0, emailEndings.length), ...emailEndings).map(ending => {
        const number = randomInt(0, 99);

        if (number == 0) return `${name.given}${choice(".", "_", "-", "")}${name.family}${ending}`;
        else return `${name.given}${choice(".", "_", "-")}${name.family}${number}${ending}`;
    });
}

function getDoeEmail(name: Name) {
    const number = randomInt(0, 99);

    if (number == 0) return `${name.given}.${name.family}@education.nsw.gov.au`;
    else return `${name.given}.${name.family}${number}@education.nsw.gov.au`;
}

export function getUserInfo() {
    const studentNumber = getStudentNumber();
    const name = getName();
    const grade = getGrade();

    return {
        username: studentNumber,
        studentId: studentNumber,
        givenName: name.given,
        surname: name.family,
        rollClass: grade.year.toString().padStart(2, "0") + grade.house,
        yearGroup: grade.year.toString(),
        role: "Student",
        department: `Year ${grade.year}`,
        office: `${grade.year}${grade.house}`,
        email: `${studentNumber}@student.sbhs.nsw.edu.au`,
        emailAliases: getEmails(name),
        decEmail: getDoeEmail(name),
        groups: []
    };
}