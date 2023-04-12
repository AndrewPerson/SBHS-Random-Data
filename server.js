#!/usr/bin/env node
import yargs from "yargs";
import fetch from 'node-fetch';
import { readFile } from "fs/promises"

const argv = yargs(process.argv.slice(2)).argv


import { fastify } from "fastify";
const server = fastify();

import fastifyCors from "@fastify/cors";

server.register(fastifyCors, { 
    origin: "*"
});

import announcements from "./announcements.js";
import dailytimetable from "./dailytimetable.js";
import timetable from "./timetable.js";
import userinfo from "./userinfo.js";

server.get("/", () => "Server up and running!");

function wrapper(func) {
    return (req, res) => {
        return func();
    };
}

function read(filePath) {
    const file = readFile(filePath, "utf-8").then(file => JSON.parse(file));

    return (req, res) => {
        return file;
    }
}

if (argv.announcements) server.get("/api/dailynews/list.json", read(argv.announcements))
else server.get("/api/dailynews/list.json", wrapper(announcements));

if (argv.dailytimetable) server.get("/api/timetable/daytimetable.json", read(argv.dailytimetable))
else server.get("/api/timetable/daytimetable.json", wrapper(dailytimetable));

if (argv.timetable) server.get("/api/timetable/timetable.json", read(argv.timetable))
else server.get("/api/timetable/timetable.json", wrapper(timetable));

if (argv.userinfo) server.get("/api/details/userinfo.json", read(argv.userinfo))
else server.get("/api/details/userinfo.json", wrapper(userinfo));

server.get("/resources", async (req, res) => {
    var termination = new Date();
    //90 Days
    termination.setHours(termination.getHours() + 90 * 24);

    return {
        result: {
            announcements: await fetch("http://localhost:8080/api/dailynews/list.json").then(res => res.json()),
            dailytimetable: await fetch("http://localhost:8080/api/timetable/daytimetable.json").then(res => res.json()),
            "next-dailytimetable": await fetch("http://localhost:8080/api/timetable/daytimetable.json").then(res => res.json()),
            timetable: await fetch("http://localhost:8080/api/timetable/timetable.json").then(res => res.json()),
            userinfo: await fetch("http://localhost:8080/api/details/userinfo.json").then(res => res.json())
        },
        token: {
            ...await fetch("http://localhost:8080/auth", { method: "POST" }).then(res => res.json()),
            termination: termination.toISOString()
        }
    };
});

server.post("/auth", async (req, res) => {
    var expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    return {
        access_token: "",
        refresh_token: "",
        expiry: expiry.toISOString(),
        scope: "all-ro"
    };
});

server.listen({
    port: argv.port ?? 8080
});