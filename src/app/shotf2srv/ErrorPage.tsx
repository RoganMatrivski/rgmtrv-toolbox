"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
	AlertCircle,
	RefreshCw,
	Wifi,
	AlertTriangle,
	Settings,
	Info,
	Clock,
	Server,
} from "lucide-react";

type ErrorType =
	| "api_error"
	| "network_error"
	| "timeout_error"
	| "server_offline"
	| "invalid_data"
	| "maintenance";

interface ErrorPageProps {
	error: {
		type: ErrorType;
		message: string;
		canRetry: boolean;
	};
	onRetry?: () => void;
	isRetrying?: boolean;
}

export default function ErrorPage({
	error,
	onRetry,
	isRetrying = false,
}: ErrorPageProps) {
	const getErrorIcon = () => {
		switch (error.type) {
			case "api_error":
				return <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />;
			case "network_error":
				return <Wifi className="h-16 w-16 text-orange-400 mx-auto" />;
			case "timeout_error":
				return <Clock className="h-16 w-16 text-yellow-400 mx-auto" />;
			case "server_offline":
				return <Server className="h-16 w-16 text-slate-400 mx-auto" />;
			case "invalid_data":
				return <AlertTriangle className="h-16 w-16 text-purple-400 mx-auto" />;
			case "maintenance":
				return <Settings className="h-16 w-16 text-blue-400 mx-auto" />;
			default:
				return <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />;
		}
	};

	const getErrorTitle = () => {
		switch (error.type) {
			case "api_error":
				return "API Error";
			case "network_error":
				return "Connection Failed";
			case "timeout_error":
				return "Request Timed Out";
			case "server_offline":
				return "Server Offline";
			case "invalid_data":
				return "Invalid Server Data";
			case "maintenance":
				return "Under Maintenance";
			default:
				return "Something Went Wrong";
		}
	};

	const getErrorDescription = () => {
		switch (error.type) {
			case "api_error":
				return "The game server API is experiencing issues. This might be temporary.";
			case "network_error":
				return "Unable to connect to the server. Check your internet connection.";
			case "timeout_error":
				return "The server took too long to respond. It might be overloaded.";
			case "server_offline":
				return "The game server is currently offline or unreachable.";
			case "invalid_data":
				return "The server returned unexpected data. Please try refreshing.";
			case "maintenance":
				return "The server is currently undergoing maintenance. Please check back later.";
			default:
				return "An unexpected error occurred while loading server information.";
		}
	};

	const getErrorColor = () => {
		switch (error.type) {
			case "api_error":
				return "border-red-500/30 bg-red-500/10";
			case "network_error":
				return "border-orange-500/30 bg-orange-500/10";
			case "timeout_error":
				return "border-yellow-500/30 bg-yellow-500/10";
			case "server_offline":
				return "border-slate-500/30 bg-slate-500/10";
			case "invalid_data":
				return "border-purple-500/30 bg-purple-500/10";
			case "maintenance":
				return "border-blue-500/30 bg-blue-500/10";
			default:
				return "border-red-500/30 bg-red-500/10";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
			<div className="max-w-md w-full space-y-6">
				{/* Error Card */}
				<Card className={`bg-slate-800/90 border-slate-700 ${getErrorColor()}`}>
					<CardContent className="pt-8 pb-6 text-center space-y-6">
						{getErrorIcon()}

						<div className="space-y-3">
							<h1 className="text-2xl font-bold text-white">
								{getErrorTitle()}
							</h1>
							<p className="text-slate-400 leading-relaxed">
								{getErrorDescription()}
							</p>
							<p className="text-sm text-slate-500 font-mono bg-slate-900/50 p-2 rounded">
								{error.message}
							</p>
						</div>

						{error.canRetry && onRetry && (
							<div className="space-y-3">
								<button
									type="button"
									onClick={onRetry}
									disabled={isRetrying}
									className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									{isRetrying ? (
										<>
											<RefreshCw className="h-4 w-4 animate-spin" />
											Retrying...
										</>
									) : (
										<>
											<RefreshCw className="h-4 w-4" />
											Try Again
										</>
									)}
								</button>

								<p className="text-xs text-slate-500">
									If the problem persists, please contact support
								</p>
							</div>
						)}

						{!error.canRetry && (
							<div className="space-y-2">
								<p className="text-sm text-slate-400">
									Please check back later or contact the server administrator
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Additional Info Card for certain error types */}
				{(error.type === "server_offline" || error.type === "maintenance") && (
					<Card className="bg-slate-800/50 border-slate-700">
						<CardContent className="pt-4 pb-4">
							<div className="flex items-start gap-3">
								<Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
								<div className="space-y-1">
									<h3 className="text-sm font-semibold text-white">
										What you can do:
									</h3>
									<ul className="text-xs text-slate-400 space-y-1">
										<li>• Check the server's official website or Discord</li>
										<li>• Try connecting directly through Steam</li>
										<li>• Look for alternative servers</li>
										{error.type === "maintenance" && (
											<li>• Maintenance usually takes 30-60 minutes</li>
										)}
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Quick Actions for Network Errors */}
				{error.type === "network_error" && (
					<Card className="bg-slate-800/50 border-slate-700">
						<CardContent className="pt-4 pb-4">
							<div className="space-y-3">
								<h3 className="text-sm font-semibold text-white flex items-center gap-2">
									<Settings className="h-4 w-4" />
									Troubleshooting Steps:
								</h3>
								<div className="grid grid-cols-1 gap-2">
									<span className="text-left p-2 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors">
										<div className="text-xs text-slate-300">
											1. Check your internet connection
										</div>
									</span>
									<span className="text-left p-2 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors">
										<div className="text-xs text-slate-300">
											2. Disable VPN if active
										</div>
									</span>
									<span className="text-left p-2 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors">
										<div className="text-xs text-slate-300">
											3. Try refreshing the page
										</div>
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
