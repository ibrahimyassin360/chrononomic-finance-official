"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { generateCSV, downloadCSV, generatePDF, downloadPDF } from "@/lib/export-utils"
import type { BondClass } from "@/types/bond-classes"
import type { ComparisonSettings } from "@/types/comparison"
import { useToast } from "@/hooks/use-toast"

interface ExportComparisonProps {
  bondClasses: BondClass[]
  settings: ComparisonSettings
  comparisonName?: string
}

export function ExportComparison({ bondClasses, settings, comparisonName }: ExportComparisonProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [exportType, setExportType] = useState<"pdf" | "csv">("pdf")
  const [filename, setFilename] = useState(`chrononomic-bond-comparison-${new Date().toISOString().split("T")[0]}`)
  const [includeDetails, setIncludeDetails] = useState(true)

  const handleExport = () => {
    try {
      if (exportType === "pdf") {
        const doc = generatePDF(bondClasses, settings, comparisonName)
        downloadPDF(doc, `${filename}.pdf`)
      } else {
        const csvContent = generateCSV(bondClasses, settings, comparisonName)
        downloadCSV(csvContent, `${filename}.csv`)
      }

      toast({
        title: "Export Successful",
        description: `Your comparison has been exported as a ${exportType.toUpperCase()} file.`,
      })

      setOpen(false)
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your comparison. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 hover-effect">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Comparison</DialogTitle>
          <DialogDescription>Export your bond comparison as a PDF or CSV file.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Export Format</h4>
            <RadioGroup
              defaultValue="pdf"
              value={exportType}
              onValueChange={(value) => setExportType(value as "pdf" | "csv")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename without extension"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeDetails"
              checked={includeDetails}
              onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
            />
            <Label htmlFor="includeDetails">Include detailed bond information</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="hover-effect">
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
