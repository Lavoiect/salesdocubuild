import React from 'react'

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";


interface View {
  timestamp: string;
  country?: string;
  region?: string;
  zip?: string;
  timeSpent?: number;
  scrollDepth?: number;
  ctaClicked?: boolean;
}

interface Props {
  views: View[];
  perPage?: number;
}




export default function ViewsTable({ views, perPage = 10 }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(views.length / perPage);

  const paginated = views.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Zip</TableHead>
            <TableHead>Time Spent</TableHead>
            <TableHead>Scroll %</TableHead>
            <TableHead>CTA Clicked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((view, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(view.timestamp).toLocaleDateString()}</TableCell>

              <TableCell>{view.country || "-"}</TableCell>
              <TableCell>{view.region || "-"}</TableCell>
              <TableCell>{view.zip || "-"}</TableCell>
              <TableCell>
                {view.timeSpent
                  ? (() => {
                    const minutes = Math.floor(view.timeSpent / 60);
                    const seconds = Math.round(view.timeSpent % 60);
                    return minutes > 0
                      ? `${minutes} min${seconds > 0 ? ` ${seconds} sec` : ""}`
                      : `${seconds} sec`;
                  })()
                  : "-"}
              </TableCell>
              <TableCell>
                {view.scrollDepth ? `${Math.round(view.scrollDepth)}%` : "-"}
              </TableCell>
              <TableCell>{view.ctaClicked ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
