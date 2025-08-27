"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CopyButton from "@/components/ui/copy-button";

import * as R from "ramda";

const textareaClasses = twMerge(
	clsx(
		"w-full p-4 border-2 rounded-lg",
		"border-gray-300 dark:border-gray-600",
		"text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
		"bg-white dark:bg-gray-800",
		"focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none",
		"resize-vertical font-mono text-sm leading-relaxed",
		"min-h-[280px]", // Comfortable height for 10+ lines
	),
);

export default function TextareaMirror() {
	const [text, setText] = useState("");
	const lines = text.split(/\r?\n|\r|\n/g);

	const matches = R.map(
		(x) => R.pipe(() => x, R.trim, R.match(/\b[a-zA-Z0-9]{8}\b/g))(),
		lines,
	);
	const joined = R.pipe(
		() => matches,
		(m: RegExpMatchArray[]) => R.filter((x) => x.length > 0, m),
		R.map((x) =>
			R.pipe(
				() => x,
				(x) => x[0],
				(s) => `https://pixeldrain.com/api/file/${s}?download`,
			)(),
		),
		R.join("\n"),
	)();

	return (
		<>
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
				<div className="w-full max-w-6xl space-y-6">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
							PixelDrain to Direct DL
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Input PixelDrain URLs (or ID directly) to get it's direct link URL{" "}
							<a href="#footer" className="text-[0.6rem] hover:underline">
								Note below
							</a>
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Editable Textarea */}
						<div>
							<label
								htmlFor="id-input"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Links (or IDs)
							</label>
							<textarea
								name="id-input"
								value={text}
								onChange={(e) => setText(e.target.value)}
								placeholder="Start typing here..."
								className={textareaClasses}
							/>
						</div>

						{/* Read-only Mirror Textarea */}
						<div>
							<label
								htmlFor="result"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Result
							</label>
							<div className="relative">
								<textarea
									name="result"
									value={joined}
									readOnly
									placeholder="Your processed URL will appear here..."
									className={twMerge(
										textareaClasses,
										"bg-gray-100 dark:bg-gray-700",
									)}
								/>
								<CopyButton value={joined} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<footer id="footer">
				<div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
					<span className="block text-xs text-gray-500 sm:text-center dark:text-gray-400">
						Note: This app do ID detection with RegEx that checks for 8
						alphanumeric text with word boundary. If the ID spec changed
						somehow, contact this{" "}
						<a
							href="https://github.com/roganmatrivski"
							className="hover:underline"
						>
							website admin
						</a>
						.
					</span>
				</div>
			</footer>
		</>
	);
}
