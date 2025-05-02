import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useWebEditor } from '@/providers/editor/editor-provider'

type Props = {
 docName: string
}

const ExportButton: React.FC<Props> = ({ docName }) => {
  const { state } = useWebEditor()

  const handleExport = async () => {
    const element = document.getElementById('editor-root')

    if (!element) {
      console.error('Editor element not found')
      return
    }

    // Clone the editor content for export
    const clonedElement = element.cloneNode(true)
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.top = '-9999px'
    tempContainer.style.left = '-9999px'
    document.body.appendChild(tempContainer)
    tempContainer.appendChild(clonedElement)

    // Wait for content to render properly before capturing it
    await new Promise(resolve => setTimeout(resolve, 100))

    // Set up 300 DPI settings for high quality export
    const dpi = 300
    const a4WidthMm = 210
    const a4HeightMm = 297
    const pxPerMm = dpi / 25.4
    const a4WidthPx = Math.floor(a4WidthMm * pxPerMm)
    const a4HeightPx = Math.floor(a4HeightMm * pxPerMm)

    const canvas = await html2canvas(tempContainer, {
      backgroundColor: '#ffffff',
      scale: dpi / 96, // Default screen DPI is 96
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = a4WidthMm
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    let position = 0
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)

    // Add more pages if necessary
    while (position + pdfHeight > a4HeightMm) {
      position -= a4HeightMm
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
    }

    pdf.save(`${docName || 'document'}.pdf`)

    // Cleanup: Remove the cloned content
    document.body.removeChild(tempContainer)
  }

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Export to PDF
    </button>
  )
}
export default ExportButton
