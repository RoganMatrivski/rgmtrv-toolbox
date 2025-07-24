import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Shield, Volume2, Server, Clock } from "lucide-react";
import type { GameServer } from "./types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Declare ServerStatusProps type
type ServerStatusProps = {
	server: GameServer;
	thumbnailUrl?: string;
	timeGet?: Date;
};

export default async function ServerStatus({
	server,
	thumbnailUrl,
	timeGet,
}: ServerStatusProps) {
	server;
	const playerPercentage = (server.players / server.max_players) * 100;
	const hasThumbnail = Boolean(thumbnailUrl);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			{/* Hero Section with Map Background */}
			<div className="relative h-96 overflow-hidden">
				<div className="absolute inset-0">
					{hasThumbnail ? (
						<>
							<Image
								src={thumbnailUrl || "/placeholder.svg"}
								alt={`${server.map_name} map screenshot`}
								fill
								className="object-cover"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
						</>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
							<div className="text-center space-y-2">
								<MapPin className="h-16 w-16 text-slate-600 mx-auto" />
								<div className="text-slate-400">No thumbnail available</div>
								<div className="text-slate-500 text-sm">
									for {server.map_name}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Server Header Overlay */}
				<div className="relative z-10 h-full flex items-end p-8">
					<div className="w-full max-w-6xl mx-auto">
						<div className="flex items-end justify-between">
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<Badge
										variant={server.reachable ? "default" : "destructive"}
										className={`${server.reachable ? "bg-green-600 hover:bg-green-700" : ""} text-sm px-3 py-1`}
									>
										{server.reachable ? "● ONLINE" : "● OFFLINE"}
									</Badge>
									{server.valve_secure && (
										<Badge
											variant="outline"
											className="text-blue-400 border-blue-400 bg-blue-400/10"
										>
											<Shield className="h-3 w-3 mr-1" />
											VAC SECURED
										</Badge>
									)}
								</div>
								<h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
									{server.name}
								</h1>
								<div className="flex items-center gap-4 text-slate-200">
									<span className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										{server.map_name}
									</span>
									<span className="flex items-center gap-2">
										<Users className="h-4 w-4" />
										{server.players}/{server.max_players}
									</span>
								</div>
							</div>

							{/* Player Count Circle */}
							<div className="hidden md:flex flex-col items-center">
								<div className="relative w-24 h-24">
									<svg
										className="w-24 h-24 transform -rotate-90"
										viewBox="0 0 100 100"
									>
										<title>Player count</title>
										<circle
											cx="50"
											cy="50"
											r="40"
											stroke="rgba(148, 163, 184, 0.3)"
											strokeWidth="8"
											fill="none"
										/>
										<circle
											cx="50"
											cy="50"
											r="40"
											stroke="rgb(59, 130, 246)"
											strokeWidth="8"
											fill="none"
											strokeDasharray={`${playerPercentage * 2.51} 251`}
											className="transition-all duration-500"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-white font-bold text-lg">
											{server.players}
										</span>
									</div>
								</div>
								<span className="text-slate-300 text-sm mt-1">Players</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="max-w-6xl mx-auto p-6 -mt-8 relative z-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Server Details */}
					<Card className="lg:col-span-2 bg-slate-800/90 border-slate-700 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-white flex items-center gap-2">
								<Server className="h-5 w-5" />
								Server Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Connection & Game Mode */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-3">
									<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
										Connection
									</h3>
									<div className="space-y-2 text-slate-300">
										<div className="flex justify-between">
											<span>IP Address:</span>
											<span className="font-mono text-blue-400">
												{server.ip}:{server.port}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Provider:</span>
											<span>{server.provider || "Unknown"}</span>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
										Game Mode
									</h3>
									<div className="space-y-2">
										<div className="flex flex-wrap gap-2">
											{server.gamemodes.map((mode) => (
												<Badge
													key={`badge-${mode}`}
													variant="secondary"
													className="bg-slate-700 text-slate-200 hover:bg-slate-600"
												>
													{mode.replace("-", " ").toUpperCase()}
												</Badge>
											))}
										</div>
										<p className="text-xs text-slate-400 font-mono">
											{server.gametype}
										</p>
									</div>
								</div>
							</div>

							<Separator className="bg-slate-700" />

							{/* Server Features */}
							<div className="space-y-3">
								<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
									Server Features
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									<div
										className={`p-3 rounded-lg border ${server.has_alltalk ? "bg-green-500/10 border-green-500/30" : "bg-slate-700/50 border-slate-600"}`}
									>
										<div className="flex items-center gap-2">
											<Volume2
												className={`h-4 w-4 ${server.has_alltalk ? "text-green-400" : "text-slate-500"}`}
											/>
											<span
												className={`text-sm ${server.has_alltalk ? "text-green-400" : "text-slate-400"}`}
											>
												All Talk
											</span>
										</div>
									</div>

									<div
										className={`p-3 rounded-lg border ${!server.has_randomcrits ? "bg-orange-500/10 border-orange-500/30" : "bg-slate-700/50 border-slate-600"}`}
									>
										<div className="flex items-center gap-2">
											<span
												className={`text-sm ${!server.has_randomcrits ? "text-orange-400" : "text-slate-400"}`}
											>
												No Crits
											</span>
										</div>
									</div>

									<div
										className={`p-3 rounded-lg border ${!server.has_norespawntime ? "bg-blue-500/10 border-blue-500/30" : "bg-slate-700/50 border-slate-600"}`}
									>
										<div className="flex items-center gap-2">
											<Clock
												className={`h-4 w-4 ${!server.has_norespawntime ? "text-blue-400" : "text-slate-500"}`}
											/>
											<span
												className={`text-sm ${!server.has_norespawntime ? "text-blue-400" : "text-slate-400"}`}
											>
												Respawn Time
											</span>
										</div>
									</div>

									<div
										className={`p-3 rounded-lg border ${!server.has_rtd ? "bg-purple-500/10 border-purple-500/30" : "bg-slate-700/50 border-slate-600"}`}
									>
										<div className="flex items-center gap-2">
											<span
												className={`text-sm ${!server.has_rtd ? "text-purple-400" : "text-slate-400"}`}
											>
												No RTD
											</span>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Quick Stats Sidebar */}
					<div className="space-y-6">
						{/* Player Stats */}
						<Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<CardTitle className="text-white text-lg flex items-center gap-2">
									<Users className="h-4 w-4" />
									Players
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center">
									<div className="text-3xl font-bold text-white">
										{server.players}
									</div>
									<div className="text-slate-400">
										of {server.max_players} slots
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-slate-400">Capacity</span>
										<span className="text-slate-300">
											{playerPercentage.toFixed(0)}%
										</span>
									</div>
									<div className="w-full bg-slate-700 rounded-full h-2">
										<div
											className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
											style={{ width: `${playerPercentage}%` }}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Map Info */}
						<Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<CardTitle className="text-white text-lg flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									Current Map
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="text-xl font-mono text-blue-400">
										{server.map_name}
									</div>
									{server.map_name_next && (
										<div className="text-sm text-slate-400">
											Next:{" "}
											<span className="text-slate-300">
												{server.map_name_next}
											</span>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
							<CardContent className="">
								<Button
									asChild
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
								>
									<Link href={`steam://connect/${server.ip}:${server.port}`}>
										Connect to Server
									</Link>
								</Button>
								<div className="mt-3 text-center">
									<span className="text-xs text-slate-400 font-mono">
										steam://connect/{server.ip}:{server.port}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Footer */}
				{timeGet && (
					<div className="mt-8 text-center text-slate-500 text-sm">
						Last updated: {timeGet.toLocaleString()}
					</div>
				)}
			</div>
		</div>
	);
}
