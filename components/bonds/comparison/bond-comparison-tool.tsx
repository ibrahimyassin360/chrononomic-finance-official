"use client"

import { useState } from "react"
import { useComparison } from "@/hooks/use-comparison"
import { SavedComparisons } from "./saved-comparisons"
import { ComparisonSettingsPanel } from "./comparison-settings"
import { ExportComparison } from "./export-comparison"
import { type BondClass, BOND_CLASSES } from "@/types/bond-classes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertCircle, Save, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export function BondComparisonTool() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("compare")
  const {
    selectedBondClasses,
    savedComparisons,
    activeComparison,
    settings,
    isLoading,
    saveCurrentComparison,
    loadComparison,
    updateSavedComparison,
    deleteSavedComparison,
    updateSettings,
    addBondClass,
    removeBondClass,
    clearComparison,
  } = useComparison()

  const handleSaveComparison = (name: string, description?: string) => {
    try {
      saveCurrentComparison(name, description)
      toast({
        title: "Comparison Saved",
        description: `Your comparison "${name}" has been saved successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error Saving Comparison",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleLoadComparison = (id: string) => {
    loadComparison(id)
    toast({
      title: "Comparison Loaded",
      description: "The saved comparison has been loaded successfully.",
    })
    setActiveTab("compare")
  }

  const handleDeleteComparison = (id: string) => {
    deleteSavedComparison(id)
    toast({
      title: "Comparison Deleted",
      description: "The saved comparison has been deleted.",
    })
  }

  const handleAddBondClass = (bondClass: BondClass) => {
    if (selectedBondClasses.length >= 4) {
      toast({
        title: "Maximum Bonds Reached",
        description: "You can compare up to 4 bond classes at a time.",
        variant: "destructive",
      })
      return
    }

    if (selectedBondClasses.includes(bondClass)) {
      toast({
        title: "Bond Already Selected",
        description: `${BOND_CLASSES[bondClass].name} is already in your comparison.`,
        variant: "destructive",
      })
      return
    }

    addBondClass(bondClass)
    toast({
      title: "Bond Added",
      description: `${BOND_CLASSES[bondClass].name} has been added to your comparison.`,
    })
  }

  const handleRemoveBondClass = (bondClass: BondClass) => {
    removeBondClass(bondClass)
    toast({
      title: "Bond Removed",
      description: `${BOND_CLASSES[bondClass].name} has been removed from your comparison.`,
    })
  }

  const handleClearComparison = () => {
    clearComparison()
    toast({
      title: "Comparison Cleared",
      description: "All bond classes have been removed from your comparison.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bond Comparison Tool</h1>
          <p className="text-muted-foreground mt-1">
            Compare different bond classes to find the best investment for your needs.
          </p>
        </div>

        <div className="flex gap-2">
          {selectedBondClasses.length > 0 && (
            <ExportComparison
              bondClasses={selectedBondClasses}
              settings={settings}
              comparisonName={activeComparison?.name}
            />
          )}

          {activeComparison && (
            <Button
              variant="outline"
              className="flex items-center gap-2 hover-effect"
              onClick={() => {
                updateSavedComparison(activeComparison.id, {
                  bondClasses: selectedBondClasses,
                  settings,
                })
                toast({
                  title: "Comparison Updated",
                  description: `Your comparison "${activeComparison.name}" has been updated.`,
                })
              }}
            >
              <Save className="h-4 w-4" />
              Update
            </Button>
          )}

          {selectedBondClasses.length > 0 && (
            <Button variant="outline" className="flex items-center gap-2 hover-effect" onClick={handleClearComparison}>
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compare" className="hover-effect">
            Compare Bonds
          </TabsTrigger>
          <TabsTrigger value="saved" className="hover-effect">
            Saved Comparisons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="space-y-6">
          {activeComparison && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Loaded Comparison</AlertTitle>
              <AlertDescription>
                You are currently viewing the saved comparison "{activeComparison.name}". Any changes you make will be
                applied to this comparison when you click "Update".
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(Object.keys(BOND_CLASSES) as BondClass[]).map((bondClass) => {
              const isSelected = selectedBondClasses.includes(bondClass)
              return (
                <Card
                  key={bondClass}
                  className={`cursor-pointer transition-all ${
                    isSelected ? `border-2 border-${BOND_CLASSES[bondClass].color}-500 shadow-md` : "hover:shadow-md"
                  }`}
                  onClick={() => (isSelected ? handleRemoveBondClass(bondClass) : handleAddBondClass(bondClass))}
                >
                  <CardHeader className={`pb-2 ${isSelected ? `bg-${BOND_CLASSES[bondClass].color}-50` : ""}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{BOND_CLASSES[bondClass].symbol}</span>
                          <span>{BOND_CLASSES[bondClass].name}</span>
                        </CardTitle>
                        <CardDescription>{BOND_CLASSES[bondClass].purpose}</CardDescription>
                      </div>
                      {isSelected && (
                        <Badge
                          className={`bg-${BOND_CLASSES[bondClass].color}-100 text-${BOND_CLASSES[bondClass].color}-800 border-${BOND_CLASSES[bondClass].color}-200`}
                        >
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Maturity:</span>
                        <span>{BOND_CLASSES[bondClass].maturity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk:</span>
                        <span>{BOND_CLASSES[bondClass].risk}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedBondClasses.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Bonds Selected</AlertTitle>
              <AlertDescription>Select at least one bond class above to start comparing.</AlertDescription>
            </Alert>
          ) : (
            <>
              <ComparisonSettingsPanel settings={settings} onSettingsChange={updateSettings} />

              <div className="flex justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button onClick={() => setActiveTab("saved")} className="hover-effect">
                          Save This Comparison
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save your current selection for future reference</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Comparison content would go here */}
              <div className="border rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Comparison Results</h3>
                <p className="text-muted-foreground">
                  Your comparison of {selectedBondClasses.length} bond classes would be displayed here.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {selectedBondClasses.map((bondClass) => (
                    <Badge
                      key={bondClass}
                      className={`bg-${BOND_CLASSES[bondClass].color}-100 text-${BOND_CLASSES[bondClass].color}-800 border-${BOND_CLASSES[bondClass].color}-200`}
                    >
                      {BOND_CLASSES[bondClass].symbol} {BOND_CLASSES[bondClass].name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <SavedComparisons
            comparisons={savedComparisons}
            onLoad={handleLoadComparison}
            onDelete={handleDeleteComparison}
            onSave={handleSaveComparison}
            selectedBondClasses={selectedBondClasses}
            canSave={selectedBondClasses.length > 0}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
