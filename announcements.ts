import { randomInt, choice, shouldDo, getTerm, getWeek, getWeekType, getDay, getRoom, getBells, getLetter, formatDate, Bells } from "./shared.js";
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

function getNotices(date: Date, bells: Bells) {
    const result = [];
    for (let i = 0; i < randomInt(1, 5); i++) {
        result.push(getNotice(date, bells));
    }

    return result;
}

function getNotice(date: Date, bells: Bells) {
    const years = getYears();
    const meeting = getMeeting(date, bells);

    return {
        id: getId(),
        title: getTitle(),
        content: getContent(),
        years: [...years.years],
        dates: getDates(date),
        relativeWeight: randomInt(1, 5),
        isMeeting: meeting.meeting,
        meetingDate: meeting.date,
        meetingTimeParsed: meeting.timeParsed,
        meetingTime: meeting.time,
        meetingLocation: meeting.location,
        displayYears: years.display,
        authorName: getAuthor()
    }
}

function getId() {
    return `${randomInt(0, 9)}${randomInt(0, 9)}${randomInt(0, 9)}${randomInt(0, 9)}${randomInt(0, 9)}`;
}

function getTitle() {
    return titleGenerator.generateSentences(1);
}

function getContent() {
    // return Htmlify(paragraphGenerator.generateParagraphs(randomInt(1, 5)), 0, 5, 0, 3);
    return paragraphGenerator.generateParagraphs(randomInt(1, 5));
}

function getYears() {
    const min = randomInt(7, 12);
    const max = randomInt(min, 12);

    const years = new Set<string>();
    for (let year = min; year <= max; year++) {
        years.add(year.toString());
    }

    if (shouldDo(0.3)) years.add("Staff");

    if (min == 7 && max == 12) {
        let display = "All Years";
        if (years.has("Staff")) display += " and Staff";

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
        let display = `Year ${min}`;
        if (years.has("Staff")) display += " and Staff";

        return {
            years: years,
            display: display
        };
    }
    else {
        let display = `Years ${min} to ${max}`;
        if (years.has("Staff")) display += " and Staff";

        return {
            years: years,
            display: display
        };
    }
}

function getDates(time: Date) {
    const result: string[] = [];

    const startOffset = randomInt(-5, 5);

    const start = new Date(time);
    start.setDate(start.getDate() + startOffset);

    const duration = randomInt(1, 5);

    for (let futureOffset = 0; futureOffset < duration; futureOffset++) {
        const date = new Date(start);
        date.setDate(date.getDate() + futureOffset);

        result.push(formatDate(date));
    }

    return result;
}

function getMeeting(date: Date, bells: Bells) {
    if (shouldDo()) {
        return {
            meeting: 0,
            date: null,
            timeParsed: "00:00:00",
            time: "",
            location: ""
        };
    }

    const dateOffset = randomInt(-5, 5);
    const meetingDate = new Date(date);
    meetingDate.setDate(meetingDate.getDate() + dateOffset);

    const time = choice(...bells.bells);

    return {
        meeting: 1,
        date: formatDate(meetingDate),
        timeParsed: time.startTime,
        time: time.bell,
        location:
            shouldDo()
                ? getRoom()
                : choice("Junior Quad", "Senior Quad", "Basketball Courts",
                         "English Staff Room", "Math Staff Room",
                         "Science Staff Room", "Music Staff Room",
                         "Geography Staff Room", "History Staff Room")
    };
}

function getAuthor() {
    const surname = nameGenerator.generateWords(1)

    return getLetter().toUpperCase() + ". " + surname[0].toUpperCase() + surname.slice(1).toLowerCase();
}

export async function getAnnouncements(date: Date, msOffset: number) {
    const result = await getBells(date, msOffset);

    return {
        dayInfo: {
            date: formatDate(result.date),
            term: getTerm().toString(),
            week: getWeek().toString(),
            //No idea what events are
            events: [],
            weekType: getWeekType(),
            dayNumber: getDay()
        },
        notices: getNotices(result.date, result.bells)
    };
}