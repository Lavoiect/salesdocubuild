'use client'
import React from 'react'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

type Props = {
    graphData: Array<{
        date: string;
        views: number;
        uniqueViews: number;
        timeSpent: number;
        timeSpentFormatted: string;
    }>;
    formatDuration: (duration: number) => string;
    title: string;
    line?: Array<{
        label: string;
        dataKey: string;
        strokeColor: string; // <- changed from Array<string> to string
    }>;
    label: string;
    formatData?: any;
};

const Graph = ({ graphData, formatDuration, title, line, label, formatData }: Props) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                            new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                        }
                    />
                    <YAxis label={{ value: label, angle: -90, position: "insideLeft" }} />
                    <Tooltip 
                        formatter={formatData}
                    />
                    {line?.map((l, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={l.dataKey}
                            stroke={l.strokeColor}
                            name={l.label}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Graph