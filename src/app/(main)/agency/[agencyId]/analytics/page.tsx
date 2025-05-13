"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";


interface Document {
    id: string;
    name: string;
    type: string; // Added type property
}
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { get } from "http";
import { getDocuments } from "@/lib/queries";
import { Separator } from "@/components/ui/separator";
import { ChartArea, RocketIcon,Table2 } from "lucide-react";
import { set } from "date-fns";
import Graph from "./_components/Graph";
import GeoTable from "./_components/GeoTable";
import ViewsTable from "./_components/ViewsTable";






interface DocumentAnalyticsProps {
    agencyId: string;
}

function normalizeDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // fallback in case of bad input
    return d.toISOString().split("T")[0]; // 'YYYY-MM-DD'
}

export default function DocumentAnalytics(props: DocumentAnalyticsProps) {
    const [documentId, setDocumentId] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState<"views" | "engagement" | "table" | "demographics" | null>(null);

    const setGraphData = (graphType: "views" | "engagement" | "demographics") => {
        setActiveSection((prev) => (prev === graphType ? "table" : graphType));
    };

    useEffect(() => {
        setActiveSection("table");
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `/api/analytics?documentId=${documentId}&start=${startDate}&end=${endDate}`
            );
            if (!res.ok) throw new Error("Failed to fetch analytics");
            const data = await res.json();
            setAnalyticsData(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message || "Unexpected error");
            setAnalyticsData([]);
            setLoading(false);
        }
    };

    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${minutes}m ${secs}s`;
    }



    const graphDates = Array.from(
        new Set([
            ...(analyticsData?.views?.results || []).map(([d]: [string]) => normalizeDate(d)),
            ...(analyticsData?.uniqueViewers?.results || []).map(([d]: [string]) => normalizeDate(d)),
            ...(analyticsData?.timeOnPage?.results || []).map(([d]: [string]) => normalizeDate(d)),
            ...(analyticsData?.CTAClicks?.results || []).map(([d]: [string]) => normalizeDate(d)),
            ...(analyticsData?.scrollDepth?.results || []).map(([d]: [string]) => normalizeDate(d)),

        ])
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const graphData = graphDates.map((date) => {
        const views = analyticsData?.views?.results?.find(([d]: [string]) => normalizeDate(d) === date)?.[1] ?? 0;
        const uniqueViews = analyticsData?.uniqueViewers?.results?.find(([d]: [string]) => normalizeDate(d) === date)?.[1] ?? 0;
        const timeSpent = analyticsData?.timeOnPage?.results?.find(([d]: [string]) => normalizeDate(d) === date)?.[1] ?? 0;
        const CTAClicks = analyticsData?.CTAClicks?.results?.find(([d]: [string]) => normalizeDate(d) === date)?.[1] ?? 0;
        const scrollDepth = analyticsData?.scrollDepth?.results?.find(([d]: [string]) => normalizeDate(d) === date)?.[1] ?? 0;
        return {
            date,
            views,
            uniqueViews,
            timeSpent,
            timeSpentFormatted: formatDuration(timeSpent),
            CTAClicks,
            scrollDepth
        };
    });



    const totalviews = Array.isArray(analyticsData?.views?.results)
        ? analyticsData.views.results.reduce((acc: number, [_, count]: [string, number]) => acc + count, 0)
        : 0;




    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const result = await getDocuments(props.agencyId);
                setDocuments(result);
            } catch (err) {
                console.error("Failed to fetch documents", err);
            }
        };

        fetchDocuments();
    }, [props.agencyId]);





    return (
        <div className="p-6 mx-auto">
            <h2 className="text-xl font-semibold mb-4">Document Analytics</h2>

            <div className="flex flex-row mb-4 gap-1">
                <div>
                    <Select
                        value={documentId}
                        onValueChange={(value) => setDocumentId(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Document" />
                        </SelectTrigger>
                        <SelectContent>
                            {documents.filter((document) => document.type === 'Document').map((document: Document) => (
                                <SelectItem key={document.id} value={document.id}>
                                    {document.name}
                                </SelectItem>
                            ))}

                        </SelectContent>
                    </Select>

                </div>
                <div>
                    <input
                        className="border flex px-2 py-1 w-full"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="border flex px-2 py-1 w-full"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={fetchAnalytics}
                        className="bg-purple-600 text-white px-4 py-2 rounded flex"
                    >
                        {loading ? "Loading..." : <>Fetch Analytics <RocketIcon className="ml-2" /></>}
                    </button>
                </div>
            </div>


            {error && <p className="text-red-500">{error}</p>}
            {graphData.length > 0 && (
                <div className="space-y-2">
                    <Card className="bg-white p-4 shadow-md">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <CardHeader className="p-0">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg">Document Anaylytics</h3>
                                        <h1 className="text-2xl">[Document Name]</h1>


                                    </div>


                                </CardHeader>
                                <div>
                                    <Separator className="mt-4 mb-4" />
                                    <div>
                                        <div className="flex gap-2 items-center justify-between">
                                            <div className="font-semibold mb-2">Viewer Metrics</div>

                                            <div className="flex">
                                                <ChartArea className="cursor-pointer" onClick={() => setGraphData("views")} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <div className="flex flex-col">Total Views</div>
                                            <div className="text-xl">{analyticsData?.views?.total?.toLocaleString() ?? "—"}</div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col">Unique Viewers</div>
                                            <div className="text-xl">{analyticsData?.uniqueViewers?.total?.toLocaleString() ?? "—"}</div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col">Time Spent</div>
                                            <div className="text-xl">{analyticsData?.timeOnPage?.formatted ?? "—"}</div>
                                        </div>
                                    </div>

                                    <Separator className="mt-4 mb-4" />
                                    <div className="flex gap-2 items-center justify-between">
                                        <div className="font-semibold mb-2">Engagement Metrics</div>

                                        <div className="flex">
                                            <ChartArea className="cursor-pointer" onClick={() => setGraphData("engagement")} />
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <div className="flex flex-col">Clicks on CTAs</div>
                                            <div className="text-xl">{analyticsData?.CTAClicks?.total?.toLocaleString() ?? "—"}</div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col">Scroll Depth</div>
                                            <div className="text-xl">{analyticsData?.scrollDepth?.average?.toLocaleString() ?? "—"}%</div>
                                        </div>

                                    </div>

                                    <Separator className="mt-4 mb-4" />
                                    <div className="flex gap-2 items-center justify-between">
                                        <div className="font-semibold mb-2">Access Info</div>

                                        <div className="flex">
                                            <Table2 className="cursor-pointer" onClick={() => setGraphData("demographics")} />
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <div className="flex flex-col">Viewer geography</div>
                                            <div className="text-xl">{analyticsData?.topCountry?.country}</div>
                                        </div>
                                        

                                    </div>
                                    <Separator className="mt-4 mb-4" />
                                    <div className="flex gap-6">
                                        <div>Created: </div>
                                        <div>Last Updated:</div>
                                    </div>
                                </div>
                            </div>



                            <div className="col-span-2">
                                {activeSection === 'table' && (
                                    <div className="grid gap-8">
                                        <div>
                                            <ViewsTable views={analyticsData?.viewsTable || []}/>
                                        </div>


                                    </div>
                                )}
                                {activeSection === 'views' && (
                                    <div className="grid gap-8">
                                        <div>
                                            <Graph
                                                title="Views & Unique Viewers"
                                                graphData={graphData}
                                                line={[
                                                    { label: "Total Views", dataKey: "views", strokeColor: "#8884d8" },
                                                    { label: "Unique Viewers", dataKey: "uniqueViews", strokeColor: "#82ca9d" },
                                                ]}
                                                formatDuration={formatDuration}
                                                label="Views"
                                            />
                                            
                                        </div>

                                        <div>
                                        <Graph
                                                title="Time Spent on Document"
                                                graphData={graphData}
                                                line={[
                                                    { label: "Time Spent", dataKey: "timeSpent", strokeColor: "#ff7300" },
                                                ]}
                                                formatDuration={formatDuration}
                                                label="Views"
                                                formatData={(value: number) => formatDuration(value)}
                                            />
                                          
                                        </div>
                                    </div>
                                )}
                                {activeSection === 'engagement' && (
                                    <div className="grid gap-8">
                                        <div>
                                        <Graph
                                                title="Clicks on CTAs"
                                                graphData={graphData}
                                                line={[
                                                    { label: "Clicks on CTAs", dataKey: "CTAClicks", strokeColor: "#ff7300" },
                                                ]}
                                                formatDuration={formatDuration}
                                                label="CTA Clicks"
                                            />                                            
                                           
                                        </div>

                                        <div>
                                        <Graph
                                                title="Scroll Rate per Day"
                                                graphData={graphData}
                                                line={[
                                                    { label: "Daily Scroll Rate", dataKey: "scrollDepth", strokeColor: "#ff7300" },
                                                ]}
                                                formatDuration={formatDuration}
                                                label="Scroll Depth"
                                            />          
                                           
                                        </div>
                                    </div>
                                )}
                                 {activeSection === 'demographics' && (
                                    <div className="grid gap-8">
                                        <GeoTable
                                            graphData={analyticsData?.geoBreakdown}
                                        />
                                    

                                    </div>
                                )}
                            </div>


                        </div>
                    </Card>

                </div>
            )}

            {graphData.length === 0 && (
                <div className="col-span-2 flex items-center justify-center h-[300px] text-gray-500">
                    <p>Select document and date range to view analytics.</p>
                </div>)}
        </div>
    );
}
