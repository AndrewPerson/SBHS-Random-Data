import { Random, Choice, ShouldDo, Term, Week, WeekType, Day, Room, Htmlify, Nameify, Resource } from "./shared";
import { LoremIpsum } from "lorem-ipsum";

const titleGenerator = new LoremIpsum({
    wordsPerSentence: {
        max: 4,
        min: 1
    }
});

const paragraphGenerator = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

const nameGenerator = new LoremIpsum();

async function Notices() {
    var result = [];
    for (var i = 0; i < Random(1, 5); i++) {
        result.push(await Notice());
    }

    return result;
}

async function Notice() {
    var years = Years();
    var meeting = await Meeting();

    return {
        id: Id(),
        title: Title(),
        content: Content(),
        years: years.years,
        dates: Dates(),
        relativeWeight: Random(1, 5),
        isMeeting: meeting.meeting,
        meetingDate: meeting.date,
        meetingTimeParsed: meeting.timeParsed,
        meetingTime: meeting.time,
        meetingLocation: meeting.location,
        displayYears: years.display,
        authorName: Author()
    }
}

function Id() {
    return `${Random(0, 9)}${Random(0, 9)}${Random(0, 9)}${Random(0, 9)}${Random(0, 9)}`;
}

function Title() {
    return titleGenerator.generateSentences(1);
}

function Content() {
    return Htmlify(paragraphGenerator.generateParagraphs(Random(1, 5)), 0, 5, 0, 3);
}

function Years() {
    var min = Random(7, 12);
    var max = Random(min - 1, 12);

    var years = [];
    for (var year = min; year <= max; year++) {
        years.push(year.toString());
    }

    var staff = ShouldDo() == 0 || max < min;

    if (staff) years.push("Staff");

    if (min == 7 && max == 12) {
        var display = "All Years";
        if (staff) display += " and Staff";

        return {
            years: years,
            display: display
        };
    }
    else if (max < min) {
        return {
            years: years,
            display: "Staff"
        };
    }
    else if (max == min) {
        var display = `Year ${min}`;
        if (staff) display += " and Staff";

        return {
            years: years,
            display: display
        };
    }
    else {
        var display = `Years ${min} to ${max}`;
        if (staff) display += " and Staff";

        return {
            years: years,
            display: display
        };
    }
}

function Dates() {
    var result = [];

    for (var i = 0; i < Random(1, 5); i++) {
        result.push(`1970-01-0${i}`);
    }

    return result;
}

async function Meeting() {
    if (ShouldDo() == 0) {
        return {
            meeting: 0,
            date: null,
            timeParsed: "00:00:00",
            time: "",
            location: ""
        };
    }

    var bells = await Resource("bells");

    var time = Choice(...bells.bells);
    
    return {
        meeting: 1,
        date: "1970-01-01",
        timeParsed: time.time,
        time: time.bell,
        location: ShouldDo() == 0 ?
                  Room()
                  :
                  Choice("Junior Quad", "Senior Quad", "Basketball Courts",
                         "English Staff Room", "Math Staff Room",
                         "Science Staff Room", "Music Staff Room",
                         "Geography Staff Room", "History Staff Room")
    };
}

function Author() {
    return Nameify(nameGenerator.generateWords(1));
}

export default async () => {
    return {
        date: 0000000000,
        dayInfo: {
            date: "1970-01-01",
            term: Term().toString(),
            week: Week().toString(),
            //No idea what events are
            events: [],
            weekType: WeekType(),
            dayNumber: Day()
        },
        dateYesterday: 0000000000,
        dateTomorrow: 0000000000,
        notices: await Notices()
    };
}