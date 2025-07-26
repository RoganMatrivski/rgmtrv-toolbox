import type {
	GameServer,
	InfoResponse,
	MapThumbnailResponse,
	ResponseError,
} from "../types";

const key = process.env.TEAMWORKTF_APIKEY;

export const getThumbnailUrl = (map: string) =>
	`https://teamwork.tf/api/v1/map-stats/mapthumbnail/${map}?key=${key}`;
export const getServerInfoUrl = (ip: string, port: string | number) =>
	`https://teamwork.tf/api/v1/quickplay/server?ip=${ip}&port=${port}&key=${key}`;

export async function getStatus() {
	const ip = "45.62.160.71";
	const port = 27015;

	const url = getServerInfoUrl(ip, port);
	const result = await fetch(url, { next: { revalidate: 5 * 60 } });

	if (!result.ok) {
		throw new Error(`Failed to fetch status for ${ip}:${port}`);
	}

	const json = await result.json<GameServer[] | ResponseError>();

	if ("error" in json) {
		throw new Error(json.error);
	}

	return json[0];
}

export async function getMapThumbnail(mapName: string): Promise<string> {
	try {
		const response = await fetch(getThumbnailUrl(mapName), {
			cache: "force-cache",
		});

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

export async function getInfo(): Promise<InfoResponse> {
	try {
		const data = await getStatus();
		const mapimg = await getMapThumbnail(data.map_name);
		return {
			...data,
			mapThumbnail: mapimg,
			fetchTime: new Date(Date.now()),
		};
		// biome-ignore lint/suspicious/noExplicitAny: catch-all exception
	} catch (e: any) {
		return { error: e };
	}
}
