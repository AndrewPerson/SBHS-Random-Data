import { Grade, Random, Choice } from "./shared.js";
import { LoremIpsum } from "lorem-ipsum";

const nameGenerator = new LoremIpsum();

function StudentNumber() {
    var result = "";

    for (var i = 0; i < 9; i++)
        result += Random(0, 9).toString();

    return result;
}

function Name() {
    var given = nameGenerator.generateWords(1);
    given = given[0].toUpperCase() + given.substring(1);

    var family = nameGenerator.generateWords(1);
    family = family[0].toUpperCase() + family.substring(1);

    return {
        given: given,
        family: family
    };
}

function Emails(name) {
    var emails = ["hotmail.com", "gmail.com", "outlook.com",
                  "student.sbhs.nsw.edu.au", "yahoo.com"];

    var result = [];

    for (var i = 0; i < Random(0, emails.length); i++) {
        var index = Random(0, emails.length);
        var email = emails.splice(index, 1)[0];

        var number = Random(0, 99);

        if (number == 0) result.push(`${name.given}${Choice(".", "_", "-", "")}${name.family}@${email}`)
        else result.push(`${name.given}${Choice(".", "_", "-")}${name.family}${number}@${email}`)
    }

    return result;
}

function DecEmail(name) {
    var number = Random(0, 9);

    if (number == 0) return `${name.given}.${name.family}@education.nsw.gov.au`;
    else return `${name.given}.${name.family}${number}@education.nsw.gov.au`;
}

export default () => {
    var studentNumber = StudentNumber();

    var name = Name();

    var grade = Grade();

    return {
        username: studentNumber,
        studentId: studentNumber,
        givenName: name.given,
        surname: name.family,
        rollClass: grade.year.length < 2 ?
                   `0${grade.year}${grade.house}`
                   :
                   `${grade.year}${grade.house}`,
        yearGroup: grade.year,
        role: "Student",
        department: `Year ${grade.year}`,
        office: `${grade.year}${grade.house}`,
        email: `${studentNumber}@student.sbhs.nsw.edu.au`,
        emailAliases: Emails(name),
        decEmail: DecEmail(name),
        groups: []
    };
}