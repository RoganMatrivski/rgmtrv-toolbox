"use client";

import { useState } from "react";

import * as R from "ramda";

enum Command {
	DECODE = "decode",
	ENCODE = "encode",
}

const strToCmd = (str?: string) => {
	switch (str) {
		case "d":
			return Command.DECODE;
		case "dec":
			return Command.DECODE;
		case "decode":
			return Command.DECODE;
		case "e":
			return Command.ENCODE;
		case "enc":
			return Command.ENCODE;
		case "encode":
			return Command.ENCODE;
		default:
			return Command.ENCODE;
	}
};

const permittedSeparator = [";", ":", "."];

function base64ToBytes(base64: string) {
	const binString = atob(base64);
	return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
}

function bytesToBase64(bytes: Uint8Array): string {
	const binString = Array.from(bytes, (byte) =>
		String.fromCodePoint(byte),
	).join("");
	return btoa(binString);
}

const invCmd = (cmd: Command) =>
	({
		[Command.DECODE]: Command.ENCODE,
		[Command.ENCODE]: Command.DECODE,
	})[cmd];

const encdec = (str: string, cmd: Command) => {
	try {
		if (cmd === Command.DECODE)
			return new TextDecoder().decode(base64ToBytes(str));
		else return bytesToBase64(new TextEncoder().encode(str));
	} catch (_) {
		return "Invalid String";
	}
};

export function InnerBase64({ q }: { q: string }) {
	const shortcutMarkIdx = R.pipe(
		R.map((s: string) => q.indexOf(s)),
		R.find(R.lt(-1)),
		R.defaultTo(0),
	)(permittedSeparator);

	const cmdStr = q.substring(0, shortcutMarkIdx);
	const textStr = q.substring(shortcutMarkIdx + 1);

	const [cmd, setCmd] = useState<Command>(strToCmd(cmdStr));
	const [str, setStr] = useState<string>(textStr);

	return (
		<div className="flex items-center justify-center min-h-screen px-4">
			<div className="w-full max-w-xl p-4 bg-white dark:bg-gray-800 shadow-md rounded-md space-y-4">
				<div className="flex items-stretch space-x-2">
					{/* Mode Selector */}
					<div className="flex-grow">
						<label
							htmlFor="mode"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Mode:
						</label>
						<select
							name="mode"
							value={cmd}
							onChange={(x) => setCmd(x.target.value as Command)}
							className="cursor-pointer block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						>
							<option value="encode">Encode</option>
							<option value="decode">Decode</option>
						</select>
					</div>

					{/* Reset Button */}
					<div className="flex flex-col justify-end">
						<button
							type="button"
							onClick={() => {
								setCmd(strToCmd());
								setStr("");
							}}
							className="cursor-pointer h-[38px] px-4 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400 dark:text-red-300 transition-colors"
						>
							Reset
						</button>
					</div>

					{/* Inverse Button */}
					<div className="flex flex-col justify-end">
						<button
							type="button"
							onClick={() => {
								setStr(encdec(str, cmd));
								setCmd(invCmd(cmd));
							}}
							className="cursor-pointer h-[38px] px-4 border border-background-500 text-background-500 rounded-md hover:bg-foreground dark:hover:bg-foreground dark:hover:text-background dark:border-background-400 dark:text-background-300 transition-colors"
						>
							Inverse
						</button>
					</div>
				</div>

				<div>
					<label
						htmlFor="input"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Input:
					</label>
					<input
						name="input"
						value={str}
						onChange={(s) => setStr(s.target.value)}
						className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
					<span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Result:
					</span>
					<span className="block font-mono text-gray-900 dark:text-gray-100">
						{encdec(str, cmd)}
					</span>
				</div>
			</div>
		</div>
	);
}
