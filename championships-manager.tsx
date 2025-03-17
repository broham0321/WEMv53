"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Edit, Trash2, Plus, Image } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type Championship, defaultChampionships } from "./championships-data"

interface ChampionshipsManagerProps {
  wrestlers: any[]
}

export function ChampionshipsManager({ wrestlers }: ChampionshipsManagerProps) {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [newChampionship, setNewChampionship] = useState<Omit<Championship, "id">>({
    name: "",
    description: "",
    division: "Men's",
    image: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null)

  useEffect(() => {
    // Load championships from localStorage
    const storedChampionships = localStorage.getItem("championships")
    if (storedChampionships) {
      setChampionships(JSON.parse(storedChampionships))
    } else {
      // Initialize with default championships
      setChampionships(defaultChampionships)
      localStorage.setItem("championships", JSON.stringify(defaultChampionships))
    }
  }, [])

  const addChampionship = () => {
    if (!newChampionship.name) {
      alert("Championship name is required")
      return
    }

    const championship: Championship = {
      ...newChampionship,
      id: Date.now().toString(),
    }

    const updatedChampionships = [...championships, championship]
    setChampionships(updatedChampionships)
    localStorage.setItem("championships", JSON.stringify(updatedChampionships))

    // Reset form
    setNewChampionship({
      name: "",
      description: "",
      division: "Men's",
      image: "",
    })
  }

  const deleteChampionship = (id: string) => {
    if (confirm("Are you sure you want to delete this championship?")) {
      const updatedChampionships = championships.filter((championship) => championship.id !== id)
      setChampionships(updatedChampionships)
      localStorage.setItem("championships", JSON.stringify(updatedChampionships))
    }
  }

  const startEditChampionship = (championship: Championship) => {
    setEditingChampionship(championship)
    setIsEditDialogOpen(true)
  }

  const saveEditChampionship = () => {
    if (!editingChampionship) return

    const updatedChampionships = championships.map((championship) =>
      championship.id === editingChampionship.id ? editingChampionship : championship,
    )

    setChampionships(updatedChampionships)
    localStorage.setItem("championships", JSON.stringify(updatedChampionships))
    setIsEditDialogOpen(false)
    setEditingChampionship(null)
  }

  const getWrestlerName = (id?: string) => {
    if (!id) return "Vacant"
    const wrestler = wrestlers.find((w) => w.id === id)
    return wrestler ? wrestler.name : "Unknown"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Championships
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Championship</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Championship Name</Label>
                <Input
                  id="name"
                  value={newChampionship.name}
                  onChange={(e) => setNewChampionship({ ...newChampionship, name: e.target.value })}
                  placeholder="Enter championship name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newChampionship.description}
                  onChange={(e) => setNewChampionship({ ...newChampionship, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Select
                  value={newChampionship.division}
                  onValueChange={(value: "Men's" | "Women's" | "Tag Team" | "Universal") =>
                    setNewChampionship({ ...newChampionship, division: value })
                  }
                >
                  <SelectTrigger id="division">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Men's">Men's</SelectItem>
                    <SelectItem value="Women's">Women's</SelectItem>
                    <SelectItem value="Tag Team">Tag Team</SelectItem>
                    <SelectItem value="Universal">Universal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newChampionship.image || ""}
                  onChange={(e) => setNewChampionship({ ...newChampionship, image: e.target.value })}
                  placeholder="Enter image URL"
                />
                {newChampionship.image && (
                  <div className="mt-2 border rounded-md p-2 flex justify-center">
                    <img
                      src={newChampionship.image || "/placeholder.svg"}
                      alt="Championship Preview"
                      className="h-20 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=80&width=120"
                      }}
                    />
                  </div>
                )}
              </div>

              <Button onClick={addChampionship} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Championship
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Championship Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Total Championships: {championships.length}</p>
                <p>Men's Division: {championships.filter((c) => c.division === "Men's").length}</p>
                <p>Women's Division: {championships.filter((c) => c.division === "Women's").length}</p>
                <p>Tag Team Division: {championships.filter((c) => c.division === "Tag Team").length}</p>
                <p>Universal Division: {championships.filter((c) => c.division === "Universal").length}</p>
                <p>Vacant Championships: {championships.filter((c) => !c.currentHolder).length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Current Champion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {championships.map((championship) => (
              <TableRow key={championship.id}>
                <TableCell>
                  {championship.image ? (
                    <img
                      src={championship.image || "/placeholder.svg"}
                      alt={championship.name}
                      className="h-10 w-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=40&width=64"
                      }}
                    />
                  ) : (
                    <div className="h-10 w-16 bg-muted flex items-center justify-center rounded">
                      <Image className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{championship.name}</TableCell>
                <TableCell>{championship.division}</TableCell>
                <TableCell>{championship.description}</TableCell>
                <TableCell>{getWrestlerName(championship.currentHolder)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditChampionship(championship)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteChampionship(championship.id)}>
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
              <DialogTitle>Edit Championship</DialogTitle>
            </DialogHeader>
            {editingChampionship && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingChampionship.name}
                    onChange={(e) => setEditingChampionship({ ...editingChampionship, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingChampionship.description}
                    onChange={(e) => setEditingChampionship({ ...editingChampionship, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-division">Division</Label>
                  <Select
                    value={editingChampionship.division}
                    onValueChange={(value: "Men's" | "Women's" | "Tag Team" | "Universal") =>
                      setEditingChampionship({ ...editingChampionship, division: value })
                    }
                  >
                    <SelectTrigger id="edit-division">
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Men's">Men's</SelectItem>
                      <SelectItem value="Women's">Women's</SelectItem>
                      <SelectItem value="Tag Team">Tag Team</SelectItem>
                      <SelectItem value="Universal">Universal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    value={editingChampionship.image || ""}
                    onChange={(e) => setEditingChampionship({ ...editingChampionship, image: e.target.value })}
                  />
                  {editingChampionship.image && (
                    <div className="mt-2 border rounded-md p-2 flex justify-center">
                      <img
                        src={editingChampionship.image || "/placeholder.svg"}
                        alt="Championship Preview"
                        className="h-20 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=80&width=120"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-current-holder">Current Champion</Label>
                  <Select
                    value={editingChampionship.currentHolder || ""}
                    onValueChange={(value) =>
                      setEditingChampionship({ ...editingChampionship, currentHolder: value || undefined })
                    }
                  >
                    <SelectTrigger id="edit-current-holder">
                      <SelectValue placeholder="Select champion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      {wrestlers.map((wrestler) => (
                        <SelectItem key={wrestler.id} value={wrestler.id}>
                          {wrestler.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={saveEditChampionship} className="w-full">
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

// Add a default export to ensure compatibility
export default ChampionshipsManager

