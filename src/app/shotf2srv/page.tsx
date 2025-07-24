import { getMapThumbnail, getStatus } from "./getter";
import ServerStatus from "./ServerStatus";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Shounic TF2 Server Status",
};

export default async function ShounicTf2ServerStatus() {
	const [info, t] = await getStatus();

	if (!info) throw new Error("Failed to get status");

	const thumbUrl = await getMapThumbnail(info.map_name);

	return <ServerStatus server={info} thumbnailUrl={thumbUrl} timeGet={t} />;
}
