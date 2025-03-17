"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type Brand, defaultBrands } from "./match-types-data"

export function BrandsManager() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [newBrand, setNewBrand] = useState<Omit<Brand, "id">>({
    name: "",
    color: "bg-gray-500",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [colorOptions] = useState([
    { name: "Red", value: "bg-red-600" },
    { name: "Blue", value: "bg-blue-600" },
    { name: "Green", value: "bg-green-600" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Purple", value: "bg-purple-600" },
    { name: "Pink", value: "bg-pink-600" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Gray", value: "bg-gray-500" },
    { name: "Black", value: "bg-black" },
  ])

  useEffect(() => {
    // Load brands from localStorage
    const storedBrands = localStorage.getItem("brands")
    if (storedBrands) {
      setBrands(JSON.parse(storedBrands))
    } else {
      // Initialize with default brands
      setBrands(defaultBrands)
      localStorage.setItem("brands", JSON.stringify(defaultBrands))
    }
  }, [])

  const addBrand = () => {
    if (!newBrand.name) {
      alert("Brand name is required")
      return
    }

    const brand: Brand = {
      ...newBrand,
      id: Date.now().toString(),
    }

    const updatedBrands = [...brands, brand]
    setBrands(updatedBrands)
    localStorage.setItem("brands", JSON.stringify(updatedBrands))

    // Reset form
    setNewBrand({
      name: "",
      color: "bg-gray-500",
    })
  }

  const deleteBrand = (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      const updatedBrands = brands.filter((brand) => brand.id !== id)
      setBrands(updatedBrands)
      localStorage.setItem("brands", JSON.stringify(updatedBrands))
    }
  }

  const startEditBrand = (brand: Brand) => {
    setEditingBrand(brand)
    setIsEditDialogOpen(true)
  }

  const saveEditBrand = () => {
    if (!editingBrand) return

    const updatedBrands = brands.map((brand) => (brand.id === editingBrand.id ? editingBrand : brand))

    setBrands(updatedBrands)
    localStorage.setItem("brands", JSON.stringify(updatedBrands))
    setIsEditDialogOpen(false)
    setEditingBrand(null)
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
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
          </svg>
          Brands
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Brand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="space-y-2">
                <Label>Brand Color</Label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <Button
                      key={color.value}
                      type="button"
                      variant={newBrand.color === color.value ? "default" : "outline"}
                      className={`h-10 ${color.value} ${color.value === "bg-black" ? "text-white" : ""}`}
                      onClick={() => setNewBrand({ ...newBrand, color: color.value })}
                    >
                      {color.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={addBrand} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Total Brands: {brands.length}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {brands.map((brand) => (
                    <div key={brand.id} className={`px-3 py-1 rounded-full text-white ${brand.color}`}>
                      {brand.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>
                  <div className={`w-6 h-6 rounded-full ${brand.color}`}></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditBrand(brand)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteBrand(brand.id)}>
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
              <DialogTitle>Edit Brand</DialogTitle>
            </DialogHeader>
            {editingBrand && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingBrand.name}
                    onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Brand Color</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.value}
                        type="button"
                        variant={editingBrand.color === color.value ? "default" : "outline"}
                        className={`h-10 ${color.value} ${color.value === "bg-black" ? "text-white" : ""}`}
                        onClick={() => setEditingBrand({ ...editingBrand, color: color.value })}
                      >
                        {color.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={saveEditBrand} className="w-full">
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

