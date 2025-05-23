import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { BondClass } from "@/types/bond-classes"
import { BOND_CLASSES } from "@/types/bond-classes"
import type { ComparisonSettings } from "@/types/comparison"

// Helper function to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Helper function to get CSV content
export function generateCSV(bondClasses: BondClass[], settings: ComparisonSettings, comparisonName?: string): string {
  // Header row
  let csv =
    ["Bond Class", "Symbol", "Purpose", "Maturity", "Risk", "Yield", "Time Density", "Features"].join(",") + "\n"

  // Data rows
  bondClasses.forEach((bondClass) => {
    const bond = BOND_CLASSES[bondClass]
    const row = [
      bond.name,
      bond.symbol,
      bond.purpose,
      bond.maturity,
      bond.risk,
      bond.yield,
      bond.timeDensity,
      bond.features.join("; "),
    ]
    csv += row.join(",") + "\n"
  })

  // Add comparison settings
  csv += "\n"
  csv += "Comparison Settings\n"
  csv += `Investment Amount,${settings.investmentAmount} ETH\n`
  csv += `Time Horizon,${settings.timeHorizon} years\n`
  csv += `Risk Tolerance,${settings.riskTolerance}\n`

  // Add metadata
  csv += "\n"
  csv += "Metadata\n"
  csv += `Generated,${formatDate(new Date())}\n`
  if (comparisonName) {
    csv += `Comparison Name,${comparisonName}\n`
  }

  return csv
}

// Helper function to download CSV
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Helper function to generate PDF
export function generatePDF(bondClasses: BondClass[], settings: ComparisonSettings, comparisonName?: string): jsPDF {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.text("Chrononomic Finance - Bond Comparison", 14, 22)

  if (comparisonName) {
    doc.setFontSize(16)
    doc.text(`Comparison: ${comparisonName}`, 14, 32)
  }

  doc.setFontSize(12)
  doc.text(`Generated on: ${formatDate(new Date())}`, 14, 42)

  // Add comparison settings
  doc.setFontSize(14)
  doc.text("Comparison Settings", 14, 55)

  const settingsData = [
    ["Investment Amount", `${settings.investmentAmount} ETH`],
    ["Time Horizon", `${settings.timeHorizon} years`],
    ["Risk Tolerance", settings.riskTolerance],
  ]

  autoTable(doc, {
    startY: 60,
    head: [["Setting", "Value"]],
    body: settingsData,
    theme: "grid",
    headStyles: { fillColor: [75, 75, 75] },
  })

  // Add bond comparison table
  doc.setFontSize(14)
  doc.text("Bond Comparison", 14, doc.lastAutoTable.finalY + 15)

  const tableData = bondClasses.map((bondClass) => {
    const bond = BOND_CLASSES[bondClass]
    return [bond.name, bond.symbol, bond.maturity, bond.risk, bond.yield, bond.timeDensity]
  })

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Bond Class", "Symbol", "Maturity", "Risk", "Yield", "Time Density"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [75, 75, 75] },
  })

  // Add bond details
  doc.setFontSize(14)
  doc.text("Bond Details", 14, doc.lastAutoTable.finalY + 15)

  bondClasses.forEach((bondClass, index) => {
    const bond = BOND_CLASSES[bondClass]

    const detailsData = [
      ["Name", bond.name],
      ["Symbol", bond.symbol],
      ["Purpose", bond.purpose],
      ["Features", bond.features.join(", ")],
      ["Description", bond.description],
    ]

    autoTable(doc, {
      startY: index === 0 ? doc.lastAutoTable.finalY + 20 : doc.lastAutoTable.finalY + 10,
      head: [[`Bond Class ${index + 1}`, ""]],
      body: detailsData,
      theme: "grid",
      headStyles: { fillColor: getColorForBond(bondClass) },
    })
  })

  // Add footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(
      "Chrononomic Finance - Crystal Oasis Reserve",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    )
  }

  return doc
}

// Helper function to download PDF
export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename)
}

// Helper function to get color for bond class
function getColorForBond(bondClass: BondClass): [number, number, number] {
  const colorMap: Record<BondClass, [number, number, number]> = {
    quantum: [75, 0, 130], // indigo
    temporal: [0, 128, 128], // teal
    ritual: [128, 0, 0], // maroon
    harmonic: [0, 100, 0], // dark green
    elemental: [139, 69, 19], // saddle brown
    celestial: [25, 25, 112], // midnight blue
  }

  return colorMap[bondClass] || [75, 75, 75] // default gray
}
