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
import { type PromoType, defaultPromoTypes } from "./match-types-data"

export function PromoTypesManager() {
  const [promoTypes, setPromoTypes] = useState<PromoType[]>([])
  const [newPromoType, setNewPromoType] = useState<Omit<PromoType, "id">>({
    name: "",
    description: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPromoType, setEditingPromoType] = useState<PromoType | null>(null)

  useEffect(() => {
    // Load promo types from localStorage
    const storedPromoTypes = localStorage.getItem("promoTypes")
    if (storedPromoTypes) {
      setPromoTypes(JSON.parse(storedPromoTypes))
    } else {
      // Initialize with default promo types
      setPromoTypes(defaultPromoTypes)
      localStorage.setItem("promoTypes", JSON.stringify(defaultPromoTypes))
    }
  }, [])

  const addPromoType = () => {
    if (!newPromoType.name) {
      alert("Promo type name is required")
      return
    }

    const promoType: PromoType = {
      ...newPromoType,
      id: Date.now().toString(),
    }

    const updatedPromoTypes = [...promoTypes, promoType]
    setPromoTypes(updatedPromoTypes)
    localStorage.setItem("promoTypes", JSON.stringify(updatedPromoTypes))

    // Reset form
    setNewPromoType({
      name: "",
      description: "",
    })
  }

  const deletePromoType = (id: string) => {
    if (confirm("Are you sure you want to delete this promo type?")) {
      const updatedPromoTypes = promoTypes.filter((promoType) => promoType.id !== id)
      setPromoTypes(updatedPromoTypes)
      localStorage.setItem("promoTypes", JSON.stringify(updatedPromoTypes))
    }
  }

  const startEditPromoType = (promoType: PromoType) => {
    setEditingPromoType(promoType)
    setIsEditDialogOpen(true)
  }

  const saveEditPromoType = () => {
    if (!editingPromoType) return

    const updatedPromoTypes = promoTypes.map((promoType) =>
      promoType.id === editingPromoType.id ? editingPromoType : promoType,
    )

    setPromoTypes(updatedPromoTypes)
    localStorage.setItem("promoTypes", JSON.stringify(updatedPromoTypes))
    setIsEditDialogOpen(false)
    setEditingPromoType(null)
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
            <path d="M21 15V6"></path>
            <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
            <path d="M12 12H3"></path>
            <path d="M16 6H3"></path>
            <path d="M12 18H3"></path>
          </svg>
          Promo Types
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Promo Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Promo Type Name</Label>
                <Input
                  id="name"
                  value={newPromoType.name}
                  onChange={(e) => setNewPromoType({ ...newPromoType, name: e.target.value })}
                  placeholder="Enter promo type name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPromoType.description}
                  onChange={(e) => setNewPromoType({ ...newPromoType, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>

              <Button onClick={addPromoType} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Promo Type
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Promo Type Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Total Promo Types: {promoTypes.length}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {promoTypes.slice(0, 5).map((promoType) => (
                    <div
                      key={promoType.id}
                      className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300"
                    >
                      {promoType.name}
                    </div>
                  ))}
                  {promoTypes.length > 5 && (
                    <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      +{promoTypes.length - 5} more
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
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoTypes.map((promoType) => (
              <TableRow key={promoType.id}>
                <TableCell className="font-medium">{promoType.name}</TableCell>
                <TableCell>{promoType.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditPromoType(promoType)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deletePromoType(promoType.id)}>
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
              <DialogTitle>Edit Promo Type</DialogTitle>
            </DialogHeader>
            {editingPromoType && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingPromoType.name}
                    onChange={(e) => setEditingPromoType({ ...editingPromoType, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingPromoType.description}
                    onChange={(e) => setEditingPromoType({ ...editingPromoType, description: e.target.value })}
                  />
                </div>

                <Button onClick={saveEditPromoType} className="w-full">
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

