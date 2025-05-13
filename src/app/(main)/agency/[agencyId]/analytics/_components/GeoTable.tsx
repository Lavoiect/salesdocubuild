import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Geo } from 'next/font/google'
  

type Props = {
  graphData: Array<{
    country: string;
    state: string;
    zip: string;
    count: string;
  }>
   
}

const GeoTable = (props: Props) => {
  return (
    <Table>
  <TableCaption>Geography Information.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Country</TableHead>
      <TableHead>State</TableHead>
      <TableHead>Zipcode</TableHead>
      <TableHead className="text-right">Total Visits</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      {props.graphData.map((item, index) => (
          <TableCell className="font-medium">{item.country}</TableCell>
      ))}
      
      {props.graphData.map((item, index) => (
          <TableCell className="font-medium">{item.state}</TableCell>
      ))}
      {props.graphData.map((item, index) => (
          <TableCell className="font-medium">{item.zip}</TableCell>
      ))}
      {props.graphData.map((item, index) => (
          <TableCell className="font-medium text-right">{item.count}</TableCell>
      ))}
    </TableRow>
  </TableBody>
</Table>

  )
}

export default GeoTable