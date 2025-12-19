"use server";

import fs from "fs";
import { getRecentDocuments, getTrendingSubjects } from "./public";

const CACHE_FILE = "./public/cache/home_data.json";

export async function getCachedSubjects() {
    if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, "utf-8");
        return JSON.parse(data).trendingSubjects;
    }
    return null;
}

export async function getCachedDocuments() {
    if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, "utf-8");
        return JSON.parse(data).recentDocuments;
    }
    return null;
}

export async function updateCachedHomeData() {
    const subs = await getTrendingSubjects()
    const recentDocs = await getRecentDocuments()
    const data = {
        trendingSubjects: subs,
        recentDocuments: recentDocs
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data));
}