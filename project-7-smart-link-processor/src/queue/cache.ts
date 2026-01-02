import { redis } from "./redis";

const ONE_DAY = 60 * 60 * 24;

export async function getCachedMetadata(url: string) {
    const key = `link:meta:${url}`;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
}

export async function setCachedMetadata(url: string, data: any) {
     const key = `link:meta:${url}`;
     await redis.set(key, JSON.stringify(data), "EX", ONE_DAY);
}