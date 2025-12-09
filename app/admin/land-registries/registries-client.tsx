// app/admin/land-registries/RegistriesClient.tsx
"use client";

import { useState } from "react";
import { LandRegistryTable } from "@/components/land-registry/land-registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function RegistriesClient() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    county: "",
    station: "",
    locations: [{ location: "", departments: "" }],
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // Fetch data with pagination
  const { data, isLoading } = useQuery({
    queryKey: ["land-registries", page],
    queryFn: async () => {
      const res = await fetch(`/api/land-registries?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  // Create or Update
  const mutation = useMutation({
    mutationFn: async (inputData: any) => {
      const url = editingItem
        ? `/api/land-registries/${editingItem.id}`
        : "/api/land-registries";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-registries"] });
      setIsFormOpen(false);
      setEditingItem(null);
      setFormData({
        county: "",
        station: "",
        locations: [{ location: "", departments: "" }],
      });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/land-registries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-registries"] });
      setDeleteId(null);
    },
  });

  const handleSubmit = () => {
    if (!formData.county || !formData.station) {
      alert("County and Station are required");
      return;
    }
    if (formData.locations.some((l) => !l.location || !l.departments)) {
      alert("All locations must have address and departments");
      return;
    }
    mutation.mutate(formData);
  };

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, { location: "", departments: "" }],
    }));
  };

  const removeLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      county: item.county,
      station: item.station,
      locations: item.locations.map((loc: any) => ({
        location: loc.location,
        departments: loc.departments,
      })),
    });
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin - Land Registries</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Registry
        </Button>
      </div>

      <LandRegistryTable
        data={data?.data || []}
        isLoading={isLoading}
        pagination={data?.pagination || { page: 1, totalPages: 1 }}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
        isAdmin={true}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingItem ? "Edit" : "Add"} Land Registry
              </h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) =>
                      setFormData({ ...formData, county: e.target.value })
                    }
                    placeholder="e.g. Mombasa"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="station">Station</Label>
                  <Input
                    id="station"
                    value={formData.station}
                    onChange={(e) =>
                      setFormData({ ...formData, station: e.target.value })
                    }
                    placeholder="e.g. Mombasa"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Locations & Departments</Label>
                  <div className="space-y-4 mt-3">
                    {formData.locations.map((loc, i) => (
                      <div
                        key={i}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 relative"
                      >
                        <Input
                          placeholder="Full address (e.g. Uhuru na Kazi Building, 1st Floor...)"
                          value={loc.location}
                          onChange={(e) => {
                            const newLocs = [...formData.locations];
                            newLocs[i].location = e.target.value;
                            setFormData({ ...formData, locations: newLocs });
                          }}
                          className="mb-3"
                        />
                        <Input
                          placeholder="Departments (comma separated, e.g. Land Registration, Land Survey)"
                          value={loc.departments}
                          onChange={(e) => {
                            const newLocs = [...formData.locations];
                            newLocs[i].departments = e.target.value;
                            setFormData({ ...formData, locations: newLocs });
                          }}
                        />
                        {formData.locations.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeLocation(i)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={addLocation}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Another Location
                  </Button>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingItem(null);
                      setFormData({
                        county: "",
                        station: "",
                        locations: [{ location: "", departments: "" }],
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Saving..." : "Save Registry"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Land Registry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              registry and all its locations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}