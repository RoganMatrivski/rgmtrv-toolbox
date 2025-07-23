import { InnerBase64 } from "./InnerPage";

export default async function Base64({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const qparam = params.q;
	const q = (Array.isArray(qparam) ? qparam.at(0) : qparam) || "";

	return <InnerBase64 q={q} />;
}
