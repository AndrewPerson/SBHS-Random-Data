import fetch from "node-fetch";

/**
 * Returns a random integer between `min` and `max`, inclusive.
 */
export function randomInt(min: number, max: number) {  
    return Math.round(
        Math.random() * (max - min) + min
    );
}

/**
 * Randoms a random value from `args`.
 */
export function choice<T>(...args: T[]) {
    return args[randomInt(0, arguments.length - 1)];
}

/**
 * Returns `amount` number of random (non-duplicate) values from `args`.
 */
export function choices<T>(amount: number, ...args: T[]) {
    if (amount > args.length) {
        throw new Error(`Required ${amount} choices for list with only ${args.length} items: ${args}`);
    }

    const result: T[] = [];

    for (let i = 0; i < amount; i++) {
        const index = randomInt(0, args.length - 1);
        const value = args.splice(index, 1)[0];

        result.push(value);
    }

    return result;
}

/**
 * Returns a random boolean. `bias` is the probability of returning `true`.
 * When bias is `0`, the result will always be `false`.
 * When bias is `1`, the result will always be `true`.
 * At `0.5`, there is an even chance of getting either `true` or `false`. 
 */
export function shouldDo(bias: number = 0.5) {
    return Math.random() > (1 - bias);
}

/**
 * Returns a random letter from a-z (all lowercase).
 */
export function getLetter() {
    return choice(
        "a", "b", "c", "d",
        "e", "f", "g", "h",
        "i", "j", "k", "l",
        "m", "n", "o", "p",
        "q", "r", "s", "t",
        "u", "v", "w", "x",
        "y", "z"
    );
}

/**
 * Returns a random school term number (between 1-4).
 */
export function getTerm() {
    return randomInt(1, 4);
}

/**
 * Returns a random school week number (between 1-11).
 */
export function getWeek() {
    return randomInt(1, 11);
}

/**
 * Returns a random week type (A, B, or C).
 */
export function getWeekType() {
    return choice("A", "B", "C");
}

/**
 * Returns a random day number (between 1-7).
 */
export function getDay() {
    return randomInt(1, 7);
}

/**
 * Returns a random room number. i.e. `109`, `220`, `312`
 */
export function getRoom() {
    return `${randomInt(1, 9)}${randomInt(0, 1)}${randomInt(0, 9)}`;
}

export type Grade = {
    /**
     * The year the student is in (7-12).
     */
    year: number;

    /**
     * The house the student is in.
     */
    house: string;
}

/**
 * Returns random grade information.
 */
export function getGrade(): Grade {
    return {
        year: randomInt(7, 12),
        house: choice("R", "S", "T", "E", "F", "M")
    };
}

/**
 * Formats a date into YYYY-MM-DD
 */
export function formatDate(date: Date) {
    return `${date.getFullYear().toString().padStart(4, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

/**
 * Formats hours and minutes into HH:MM
 */
export function formatTime(hours: number, minutes: number) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Extracts hours and minutes from HH:MM format
 */
export function getTimeFromFormatted(formatted: string) {
    const [hours, minutes] = formatted.split(":");

    return {
        hours: parseInt(hours),
        minutes: parseInt(minutes)
    }
}

export type Bells = {
    day: string;
    date: string;
    weekType: string;
    dayNumber: string;
    bells: Bell[];
}

export type Bell = {
    period: string;
    startTime: string;
    endTime: string | null;
    bell: string;
}

function shiftTime(hours: number, minutes: number, msOffset: number) {
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);

    time.setTime(time.getTime() + msOffset);

    return {
        hours: time.getHours(),
        minutes: time.getMinutes()
    }
}

export async function getBells(date: Date, msOffset: number): Promise<{ bells: Bells, date: Date }> {
    const offsetDate = new Date(date);
    
    const url = new URL("https://student.sbhs.net.au/api/timetable/bells.json");
    url.searchParams.append("date", formatDate(offsetDate));

    let bells = await fetch(url).then(data => data.json()) as (Bells & { status: "Ok" }) | { status: "Error" };

    while (bells.status == "Error") {
        offsetDate.setDate(offsetDate.getDate() + 1);

        url.searchParams.set("date", formatDate(offsetDate));

        bells = await fetch(url).then(data => data.json()) as (Bells & { status: "Ok" }) | { status: "Error" };
    }

    for (const bell of bells.bells) {
        const start = getTimeFromFormatted(bell.startTime);
        const shiftedStart = shiftTime(start.hours, start.minutes, msOffset);
        bell.startTime = formatTime(shiftedStart.hours, shiftedStart.minutes);

        if (bell.endTime != null) {
            const end = getTimeFromFormatted(bell.endTime);
            const shiftedEnd = shiftTime(end.hours, end.minutes, msOffset);
            bell.endTime = formatTime(shiftedEnd.hours, shiftedEnd.minutes);
        }
    }

    return {
        bells,
        date: offsetDate
    };
}
