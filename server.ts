#!/usr/bin/env node
import yargs from "yargs";
import { readFile } from "fs/promises";
import path from "path";

const argv = yargs(process.argv.slice(2))
                .number("port")
                .demandOption("port")
                .string("announcements")
                .string("dailytimetable")
                .string("timetable")
                .string("userinfo")
                .string("date")
                .coerce("date", (date: string) => {
                    const result = new Date(date);
                    
                    if (Number.isNaN(result.getMilliseconds())) {
                        throw new Error(`${date} is an invalid date.`);
                    }

                    return result;
                })
                .number("msOffset")
                .default("msOffset", 0)
                .parseSync()

import { fastify, FastifyRequest, FastifyReply } from "fastify";
const server = fastify();

import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";

server.register(fastifyCors, { 
    origin: "*"
});

server.register(fastifyStatic, {
    root: path.join(__dirname, "config"),
    prefix: "/config/",
});

server.register(fastifyFormbody);

import { getAnnouncements } from "./announcements.js";
import { getDailyTimetable } from "./dailytimetable.js";
import { getTimetable } from "./timetable.js";
import { getUserInfo } from "./user-info.js";

server.get("/", () => "Server up and running!");

function wrapper<T>(func: () => Promise<T>) {
    return (_: FastifyRequest, __: FastifyReply) => {
        return func().catch(e => {
            console.error(e);
            throw e;
        });
    };
}

function read(filePath: string) {
    const file = readFile(filePath, "utf-8").then(file => JSON.parse(file));

    return (_: FastifyRequest, __: FastifyReply) => {
        return file;
    }
}

let date = argv.date;
let msOffset = argv.msOffset;

if (argv.announcements !== undefined) server.get("/api/dailynews/list.json", read(argv.announcements))
else server.get("/api/dailynews/list.json", wrapper(() => getAnnouncements(date ?? new Date(), msOffset)));

if (argv.dailytimetable !== undefined) server.get("/api/timetable/daytimetable.json", read(argv.dailytimetable))
else server.get("/api/timetable/daytimetable.json", wrapper(() => getDailyTimetable(date ?? new Date(), msOffset)));

if (argv.timetable !== undefined) server.get("/api/timetable/timetable.json", read(argv.timetable))
else server.get("/api/timetable/timetable.json", wrapper(() => getTimetable(date ?? new Date(), msOffset)));

if (argv.userinfo !== undefined) server.get("/api/details/userinfo.json", read(argv.userinfo))
else server.get("/api/details/userinfo.json", wrapper(() => Promise.resolve(getUserInfo())));

server.post("/api/token", (_, __) => {
    return {
        access_token: "",
        refresh_token: "",
        expires_in: 3600,
    }
});

// Config paths

server.get("/config/ms-offset", (req, res) => msOffset);
server.post("/config/ms-offset", (req, res) => {
    if (typeof req.body !== "string") {
        res.statusCode = 400;
        return null;
    }

    const newMsOffset = parseInt(req.body)

    if (isNaN(newMsOffset)) {
        res.statusCode = 400;
        return null;
    }

    msOffset = newMsOffset;

    return null;
});

server.get("/config/date", (req, res) => date);
server.post("/config/date", (req, res) => {
    if (typeof req.body !== "string") {
        res.statusCode = 400;
        return null;
    }

    const newDate = new Date(req.body);

    if (isNaN(newDate.getTime())) {
        res.statusCode = 400;
        return null;
    }

    date = newDate;

    return null;
});

server.listen({
    port: argv.port,
});