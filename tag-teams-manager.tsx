"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type TagTeam, defaultTagTeams } from "./tag-teams-data"

interface TagTeamsManagerProps {
  wrestlers: any[]
  championships: any[]
}

export function TagTeamsManager({ wrestlers, championships }: TagTeamsManagerProps) {
  const [tagTeams, setTagTeams] = useState<TagTeam[]>([])
  const [newTagTeam, setNewTagTeam] = useState<Omit<TagTeam, "id">>({
    name: "",
    members: [],
    championships: [],
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTagTeam, setEditingTagTeam] = useState<TagTeam | null>(null)

  useEffect(() => {
    // Load tag teams from localStorage
    const storedTagTeams = localStorage.getItem("tagTeams")
    if (storedTagTeams) {
      setTagTeams(JSON.parse(storedTagTeams))
    } else {
      // Initialize with default tag teams
      setTagTeams(defaultTagTeams)
      localStorage.setItem("tagTeams", JSON.stringify(defaultTagTeams))
    }
  }, [])

  const addTagTeam = () => {
    if (!newTagTeam.name) {
      alert("Tag team name is required")
      return
    }

    const tagTeam: TagTeam = {
      ...newTagTeam,
      id: Date.now().toString(),
    }

    const updatedTagTeams = [...tagTeams, tagTeam]
    setTagTeams(updatedTagTeams)
    localStorage.setItem("tagTeams", JSON.stringify(updatedTagTeams))

    // Reset form
    setNewTagTeam({
      name: "",
      members: [],
      championships: [],
    })
  }

  const deleteTagTeam = (id: string) => {
    if (confirm("Are you sure you want to delete this tag team?")) {
      const updatedTagTeams = tagTeams.filter((tagTeam) => tagTeam.id !== id)
      setTagTeams(updatedTagTeams)
      localStorage.setItem("tagTeams", JSON.stringify(updatedTagTeams))
    }
  }

  const startEditTagTeam = (tagTeam: TagTeam) => {
    setEditingTagTeam(tagTeam)
    setIsEditDialogOpen(true)
  }

  const saveEditTagTeam = () => {
    if (!editingTagTeam) return

    const updatedTagTeams = tagTeams.map((tagTeam) => (tagTeam.id === editingTagTeam.id ? editingTagTeam : tagTeam))

    setTagTeams(updatedTagTeams)
    localStorage.setItem("tagTeams", JSON.stringify(updatedTagTeams))
    setIsEditDialogOpen(false)
    setEditingTagTeam(null)
  }

  const toggleWrestlerInTeam = (wrestlerId: string, teamState: Omit<TagTeam, "id"> | TagTeam) => {
    const isInTeam = teamState.members.includes(wrestlerId)

    if (isInTeam) {
      return {
        ...teamState,
        members: teamState.members.filter((id) => id !== wrestlerId),
      }
    } else {
      return {
        ...teamState,
        members: [...teamState.members, wrestlerId],
      }
    }
  }

  const toggleChampionshipForTeam = (championshipId: string, teamState: Omit<TagTeam, "id"> | TagTeam) => {
    const hasChampionship = teamState.championships.includes(championshipId)

    if (hasChampionship) {
      return {
        ...teamState,
        championships: teamState.championships.filter((id) => id !== championshipId),
      }
    } else {
      return {
        ...teamState,
        championships: [...teamState.championships, championshipId],
      }
    }
  }

  const getTagTeamChampionships = () => {
    return championships.filter((c) => c.division === "Tag Team")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Tag Teams
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Tag Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tag Team Name</Label>
                <Input
                  id="name"
                  value={newTagTeam.name}
                  onChange={(e) => setNewTagTeam({ ...newTagTeam, name: e.target.value })}
                  placeholder="Enter tag team name"
                />
              </div>

              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                  <div className="grid grid-cols-1 gap-1">
                    {wrestlers.map((wrestler) => (
                      <Button
                        key={wrestler.id}
                        variant={newTagTeam.members.includes(wrestler.id) ? "default" : "outline"}
                        onClick={() => setNewTagTeam(toggleWrestlerInTeam(wrestler.id, newTagTeam))}
                        className="justify-start w-full"
                        size="sm"
                      >
                        {wrestler.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Championships</Label>
                <div className="grid grid-cols-1 gap-1">
                  {getTagTeamChampionships().map((championship) => (
                    <Button
                      key={championship.id}
                      variant={newTagTeam.championships.includes(championship.id) ? "default" : "outline"}
                      onClick={() => setNewTagTeam(toggleChampionshipForTeam(championship.id, newTagTeam))}
                      className="justify-start w-full"
                      size="sm"
                    >
                      {championship.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={addTagTeam} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Tag Team
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tag Team Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Total Tag Teams: {tagTeams.length}</p>
                <p>Championship Holders: {tagTeams.filter((team) => team.championships.length > 0).length}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tagTeams.slice(0, 5).map((team) => (
                    <div
                      key={team.id}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300"
                    >
                      {team.name}
                    </div>
                  ))}
                  {tagTeams.length > 5 && (
                    <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      +{tagTeams.length - 5} more
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
              <TableHead>Members</TableHead>
              <TableHead>Championships</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagTeams.map((tagTeam) => (
              <TableRow key={tagTeam.id}>
                <TableCell className="font-medium">{tagTeam.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {tagTeam.members.map((memberId) => {
                      const wrestler = wrestlers.find((w) => w.id === memberId)
                      return wrestler ? (
                        <Badge key={memberId} variant="outline">
                          {wrestler.name}
                        </Badge>
                      ) : null
                    })}
                    {tagTeam.members.length === 0 && <span className="text-muted-foreground">No members</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {tagTeam.championships.map((championshipId) => {
                      const championship = championships.find((c) => c.id === championshipId)
                      return championship ? (
                        <Badge
                          key={championshipId}
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 border-yellow-300"
                        >
                          {championship.name}
                        </Badge>
                      ) : null
                    })}
                    {tagTeam.championships.length === 0 && <span className="text-muted-foreground">None</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditTagTeam(tagTeam)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTagTeam(tagTeam.id)}>
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
              <DialogTitle>Edit Tag Team</DialogTitle>
            </DialogHeader>
            {editingTagTeam && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingTagTeam.name}
                    onChange={(e) => setEditingTagTeam({ ...editingTagTeam, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Team Members</Label>
                  <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-1">
                      {wrestlers.map((wrestler) => (
                        <Button
                          key={wrestler.id}
                          variant={editingTagTeam.members.includes(wrestler.id) ? "default" : "outline"}
                          onClick={() => setEditingTagTeam(toggleWrestlerInTeam(wrestler.id, editingTagTeam))}
                          className="justify-start w-full"
                          size="sm"
                        >
                          {wrestler.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Championships</Label>
                  <div className="grid grid-cols-1 gap-1">
                    {getTagTeamChampionships().map((championship) => (
                      <Button
                        key={championship.id}
                        variant={editingTagTeam.championships.includes(championship.id) ? "default" : "outline"}
                        onClick={() => setEditingTagTeam(toggleChampionshipForTeam(championship.id, editingTagTeam))}
                        className="justify-start w-full"
                        size="sm"
                      >
                        {championship.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={saveEditTagTeam} className="w-full">
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

export default TagTeamsManager

