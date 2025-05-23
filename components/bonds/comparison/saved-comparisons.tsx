"use client"

import { useState } from "react"
import type { SavedComparison } from "@/types/comparison"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/services/bond-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { BOND_CLASSES } from "@/types/bond-classes"

interface SavedComparisonsProps {
  comparisons: SavedComparison[]
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onSave: (name: string, description?: string) => void
  selectedBondClasses: string[]
  canSave: boolean
}

export function SavedComparisons({
  comparisons,
  onLoad,
  onDelete,
  onSave,
  selectedBondClasses,
  canSave,
}: SavedComparisonsProps) {
  const [newComparisonName, setNewComparisonName] = useState("")
  const [newComparisonDescription, setNewComparisonDescription] = useState("")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleSave = () => {
    if (!newComparisonName.trim()) return

    onSave(newComparisonName, newComparisonDescription)
    setNewComparisonName("")
    setNewComparisonDescription("")
    setSaveDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Saved Comparisons</h3>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={!canSave} className="hover-effect">
              Save Current Comparison
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Comparison</DialogTitle>
              <DialogDescription>Save your current comparison setup to access it later.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newComparisonName}
                  onChange={(e) => setNewComparisonName(e.target.value)}
                  className="col-span-3"
                  placeholder="My Comparison"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newComparisonDescription}
                  onChange={(e) => setNewComparisonDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Optional description of this comparison"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Bonds</Label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {selectedBondClasses.map((bondClass) => (
                    <Badge key={bondClass} variant="outline">
                      {BOND_CLASSES[bondClass as keyof typeof BOND_CLASSES].name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleSave} disabled={!newComparisonName.trim()} className="hover-effect">
                Save Comparison
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {comparisons.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No saved comparisons yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select bond classes to compare and save your setup for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.map((comparison) => (
            <Card key={comparison.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{comparison.name}</CardTitle>
                <CardDescription>{comparison.description || "No description provided"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Created: {formatDate(new Date(comparison.createdAt))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last modified: {formatDate(new Date(comparison.lastModified))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {comparison.bondClasses.map((bondClass) => (
                      <TooltipProvider key={bondClass}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={`bg-${BOND_CLASSES[bondClass].color}-100 text-${BOND_CLASSES[bondClass].color}-800 border-${BOND_CLASSES[bondClass].color}-200`}
                            >
                              {BOND_CLASSES[bondClass].symbol}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{BOND_CLASSES[bondClass].name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => onLoad(comparison.id)} className="hover-effect">
                  Load
                </Button>

                <AlertDialog open={deleteId === comparison.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 hover-effect"
                      onClick={() => setDeleteId(comparison.id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the saved comparison "{comparison.name}". This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
