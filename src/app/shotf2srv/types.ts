export interface GameServer {
	ip: string;
	port: string;
	name: string;
	reachable: boolean;
	provider: string | null;
	valve_secure: boolean;
	map_name: string;
	map_name_next: string | null;
	players: number;
	max_players: number;
	gamemodes: string[];
	gametype: string;
	has_password: boolean | null;
	has_rtd: boolean;
	has_randomcrits: boolean | null;
	has_norespawntime: boolean;
	has_alltalk: boolean;
}

export interface MapThumbnailResponse {
	thumbnail: string;
}

export interface ResponseError {
	error: string;
}

export type InfoResponse =
	| (GameServer & {
			mapThumbnail: string;
			fetchTime: Date;
	  })
	| ResponseError;
