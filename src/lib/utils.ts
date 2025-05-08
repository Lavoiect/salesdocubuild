import { EditorElement } from "@/providers/editor/editor-provider";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"



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


export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)

  const parts = []
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(" ")
}



