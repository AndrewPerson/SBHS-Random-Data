const serverTimeInput = document.getElementById("server-time");

document.getElementById("use-current-time").addEventListener("click", _ => {
    serverTimeInput.value = formatDate(new Date());
});

document.getElementById("submit").addEventListener("click", _ => {
    updateServerFromInput();
});

updateInputFromServer();

async function updateInputFromServer() {
    const [dateString, msOffset] = await Promise.all(
        [fetch("/config/date"), fetch("/config/ms-offset")]
            .map(promise => promise.then((res) => res.json()))
    );

    const date = new Date(dateString);

    const now = new Date();
    const dateTime = now.getTime() % 86400000;

    date.setTime(date.getTime() + dateTime - msOffset);

    serverTimeInput.value = formatDate(date);
}

async function updateServerFromInput() {
    const date = new Date(serverTimeInput.value);
    date.setHours(0, 0, 0, 0);

    const msOffset = new Date().getTime() % 86400000 - new Date(serverTimeInput.value).getTime() % 86400000;

    await Promise.all([
        fetch("/config/date", {
            method: "POST",
            body: date.toString()
        }),
        fetch("/config/ms-offset", {
            method: "POST",
            body: msOffset
        })
    ]);

    await updateInputFromServer();
}

function formatDate(date) {
    return [
        date.getFullYear().toString().padStart(4, "0"),
        (date.getMonth() + 1).toString().padStart(2, "0"),
        date.getDate().toString().padStart(2, "0"),
    ].join('-') +
    ' ' +
    [
        date.getHours().toString().padStart(2, "0"),
        date.getMinutes().toString().padStart(2, "0"),
        date.getSeconds().toString().padStart(2, "0")
    ].join(':');
}