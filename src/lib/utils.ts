import { EditorElement } from "@/providers/editor/editor-provider";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const findParentContainerId = (
  elements: EditorElement[],
  childId: string
): string | null => {
  for (const el of elements) {
    if (Array.isArray(el.content)) {
      if (el.content.some((child) => child.id === childId)) {
        return el.id;
      }

      const deeper = findParentContainerId(el.content, childId);
      if (deeper) return deeper;
    }
  }

  return null;
};


// utils/exportToPdf.ts



