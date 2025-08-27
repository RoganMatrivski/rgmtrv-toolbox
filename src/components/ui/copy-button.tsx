"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Copy, Check, X } from "lucide-react";

interface CopyButtonProps {
	value: string;
	className?: string;
}

export default function CopyButton({ value, className }: CopyButtonProps) {
	const [copyState, setCopyState] = useState<"idle" | "success" | "error">(
		"idle",
	);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopyState("success");
			setTimeout(() => setCopyState("idle"), 2000);
		} catch (_err: unknown) {
			setCopyState("error");
			setTimeout(() => setCopyState("idle"), 2000);
		}
	};

	const getIcon = () => {
		switch (copyState) {
			case "success":
				return <Check className={twMerge("w-4 h-4", className)} />;
			case "error":
				return <X className={twMerge("w-4 h-4", className)} />;
			default:
				return <Copy className={twMerge("w-4 h-4", className)} />;
		}
	};

	const getButtonClasses = () => {
		const baseClasses =
			"absolute top-3 right-3 p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2";

		switch (copyState) {
			case "success":
				return twMerge(
					baseClasses,
					"bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 focus:ring-green-200 dark:focus:ring-green-800",
				);
			case "error":
				return twMerge(
					baseClasses,
					"bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 focus:ring-red-200 dark:focus:ring-red-800",
				);
			default:
				return twMerge(
					baseClasses,
					"bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-gray-200 dark:focus:ring-gray-700",
				);
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={getButtonClasses()}
			title={
				copyState === "success"
					? "Copied!"
					: copyState === "error"
						? "Copy failed"
						: "Copy text"
			}
		>
			{getIcon()}
		</button>
	);
}
