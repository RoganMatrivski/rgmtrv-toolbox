import ServerStatus from "./ServerStatus";
import type { Metadata } from "next";
import type { InfoResponse } from "./types";
import { getInfo } from "./lib/fetcher";

export const metadata: Metadata = {
	title: "Shounic TF2 Server Status",
};

export default async function ShounicTf2ServerStatus() {
	const info = await getInfo();

	if ("error" in info) throw new Error(info.error);

	return (
		<ServerStatus
			server={info}
			thumbnailUrl={info.mapThumbnail}
			// timeGet={info.fetchTime}
		/>
	);
}
