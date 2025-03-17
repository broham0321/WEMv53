"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { type MatchType, defaultMatchTypes } from "./match-types-data"

export function MatchTypesManager() {
  const [matchTypes, setMatchTypes] = useState<MatchType[]>([])
  const [newMatchType, setNewMatchType] = useState<Omit<MatchType, "id">>({
    name: "",
    description: "",
    category: "Match",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMatchType, setEditingMatchType] = useState<MatchType | null>(null)

  useEffect(() => {
    // Load match types from localStorage
    const storedMatchTypes = localStorage.getItem("matchTypes")
    if (storedMatchTypes) {
      setMatchTypes(JSON.parse(storedMatchTypes))
    } else {
      // Initialize with default match types
      setMatchTypes(defaultMatchTypes)
      localStorage.setItem("matchTypes", JSON.stringify(defaultMatchTypes))
    }
  }, [])

  const addMatchType = () => {
    if (!newMatchType.name) {
      alert("Match type name is required")
      return
    }

    const matchType: MatchType = {
      ...newMatchType,
      id: Date.now().toString(),
    }

    const updatedMatchTypes = [...matchTypes, matchType]
    setMatchTypes(updatedMatchTypes)
    localStorage.setItem("matchTypes", JSON.stringify(updatedMatchTypes))

    // Reset form
    setNewMatchType({
      name: "",
      description: "",
      category: "Match",
    })
  }

  const deleteMatchType = (id: string) => {
    if (confirm("Are you sure you want to delete this match type?")) {
      const updatedMatchTypes = matchTypes.filter((matchType) => matchType.id !== id)
      setMatchTypes(updatedMatchTypes)
      localStorage.setItem("matchTypes", JSON.stringify(updatedMatchTypes))
    }
  }

  const startEditMatchType = (matchType: MatchType) => {
    setEditingMatchType(matchType)
    setIsEditDialogOpen(true)
  }

  const saveEditMatchType = () => {
    if (!editingMatchType) return

    const updatedMatchTypes = matchTypes.map((matchType) =>
      matchType.id === editingMatchType.id ? editingMatchType : matchType,
    )

    setMatchTypes(updatedMatchTypes)
    localStorage.setItem("matchTypes", JSON.stringify(updatedMatchTypes))
    setIsEditDialogOpen(false)
    setEditingMatchType(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-5 w-5"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
          </svg>
          Match Types
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Match Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Match Type Name</Label>
                <Input
                  id="name"
                  value={newMatchType.name}
                  onChange={(e) => setNewMatchType({ ...newMatchType, name: e.target.value })}
                  placeholder="Enter match type name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMatchType.description}
                  onChange={(e) => setNewMatchType({ ...newMatchType, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newMatchType.category}
                  onValueChange={(value: "Match" | "Promo" | "Other") =>
                    setNewMatchType({ ...newMatchType, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Match">Match</SelectItem>
                    <SelectItem value="Promo">Promo</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addMatchType} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Match Type
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Type Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Total Match Types: {matchTypes.length}</p>
                <p>Matches: {matchTypes.filter((m) => m.category === "Match").length}</p>
                <p>Promos: {matchTypes.filter((m) => m.category === "Promo").length}</p>
                <p>Other: {matchTypes.filter((m) => m.category === "Other").length}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {matchTypes.slice(0, 5).map((matchType) => (
                    <div
                      key={matchType.id}
                      className={`px-3 py-1 rounded-full ${
                        matchType.category === "Promo"
                          ? "bg-purple-100 text-purple-800 border-purple-300"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {matchType.name}
                    </div>
                  ))}
                  {matchTypes.length > 5 && (
                    <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      +{matchTypes.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchTypes.map((matchType) => (
              <TableRow key={matchType.id}>
                <TableCell className="font-medium">{matchType.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      matchType.category === "Promo"
                        ? "secondary"
                        : matchType.category === "Other"
                          ? "outline"
                          : "default"
                    }
                  >
                    {matchType.category}
                  </Badge>
                </TableCell>
                <TableCell>{matchType.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditMatchType(matchType)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMatchType(matchType.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Match Type</DialogTitle>
            </DialogHeader>
            {editingMatchType && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingMatchType.name}
                    onChange={(e) => setEditingMatchType({ ...editingMatchType, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingMatchType.description}
                    onChange={(e) => setEditingMatchType({ ...editingMatchType, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingMatchType.category}
                    onValueChange={(value: "Match" | "Promo" | "Other") =>
                      setEditingMatchType({ ...editingMatchType, category: value })
                    }
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Match">Match</SelectItem>
                      <SelectItem value="Promo">Promo</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={saveEditMatchType} className="w-full">
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

