import QuickLRU from "quick-lru";
import type { GameServer, MapThumbnailResponse, ResponseError } from "./types";

const key = process.env.TEAMWORKTF_APIKEY;

export const getThumbnailUrl = (map: string) =>
	`https://teamwork.tf/api/v1/map-stats/mapthumbnail/${map}?key=${key}`;
export const getServerInfoUrl = (ip: string, port: string | number) =>
	`https://teamwork.tf/api/v1/quickplay/server?ip=${ip}&port=${port}&key=${key}`;

const resCache = new QuickLRU<string, [Response, Date]>({
	maxSize: 100_000,
	maxAge: 1000 * 60 * 5,
});

//! TODO: Fix Body has been read already
async function hitIfMiss(url: string) {
	return [await fetch(url), new Date()] as [Response, Date];

	// biome-ignore lint/correctness/noUnreachable: Wait fix
	if (resCache.has(url)) {
		const res = resCache.get(url)!;

		// biome-ignore lint/style/noNonNullAssertion: it passed has() already
		return resCache.get(url)!;
	}

	const response = await fetch(url);
	const cloned = response.clone();
	resCache.set(url, [cloned, new Date()]);
	return [response, new Date()] as [Response, Date];
}

export async function getStatus() {
	const ip = "45.62.160.71";
	const port = 27015;

	const url = getServerInfoUrl(ip, port);
	const [result, timeGet] = await hitIfMiss(url);

	if (!result.ok) {
		throw new Error(`Failed to fetch status for ${ip}:${port}`);
	}

	const json = await result.json<GameServer[] | ResponseError>();

	if ("error" in json) {
		throw new Error(json.error);
	}

	const tupleRes: [GameServer | undefined, Date] = [json.at(0), timeGet];

	return tupleRes;
}

export async function getMapThumbnail(mapName: string): Promise<string> {
	try {
		const [response] = await hitIfMiss(getThumbnailUrl(mapName));

		if (!response.ok) {
			throw new Error(`Failed to fetch thumbnail for map: ${mapName}`);
		}

		const data = await response.json<MapThumbnailResponse | ResponseError>();

		// Check if response contains an error
		if ("error" in data) {
			throw new Error(`Map thumbnail error for ${mapName}: ${data.error}`);
		}

		return data.thumbnail;
	} catch (error) {
		throw new Error(
			`Error fetching map thumbnail for ${mapName}:`,
			error as Error,
		);
	}
}
