const axios = require("axios").default;

function Random(min, max) {  
    return Math.round(
        Math.random() * (max - min) + min
    );
}

function Choice() {
    return arguments[Random(0, arguments.length - 1)];
}

function ShouldDo() {
    return Math.random() > 0.5;
}

function Letter() {
    return Choice("a", "b", "c", "d",
                  "e", "f", "g", "h",
                  "i", "j", "k", "l",
                  "m", "n", "o", "p",
                  "q", "r", "s", "t",
                  "u", "v", "w", "x",
                  "y", "z");
}

function Term() {
    return Random(1, 4);
}

function Week() {
    return Random(1, 10);
}

function WeekType() {
    return ["A", "B", "C"][Random(0, 2)];
}

function Day() {
    return Random(1, 7);
}

function Room() {
    return `${Random(1, 9)}${Random(0, 1)}${Random(0, 9)}`;
}

function Grade() {
    return {
        year: Random(7, 12).toString(),
        house: Choice("R", "S", "T", "E", "F", "M")
    };
}

function Htmlify(string, minChunks, maxChunks, minDepth, maxDepth) {
    var chunks = Random(minChunks, maxChunks);
    var depth = Random(minDepth, maxDepth);

    return string;
}

function Nameify(string) {
    if (string.length <= 2) return string[0].toUpperCase();

    return string[0].toUpperCase() + " " + string[1].toUpperCase() + string.substring(2);
}

async function Resource(resource) {
    if (resource == "bells") {
        return (await axios.get("https://student.sbhs.net.au/api/timetable/bells.json")).data;
    }
    
    return null;
}

module.exports = { Random, Choice, ShouldDo, Letter, Term, Week, WeekType, Day, Room, Grade, Htmlify, Nameify, Resource };