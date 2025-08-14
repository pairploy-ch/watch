'use client'

import { getColumns } from "./columns"
import { DataTable } from "./data-table"
import WatchFormDialog from "./watch-form-dialog"
import { Watch, Supplier } from "@/lib/types"
import React, { useState } from "react"
import ImageViewerDialog from "./image-viewer-dialog"

interface WatchesClientPageProps {
  initialWatches: Watch[];
  initialSuppliers: Supplier[];
  userRole: 'admin' | 'marketing' | 'viewer' | null;
}

export default function WatchesClientPage({ 
  initialWatches, 
  initialSuppliers, 
  userRole 
}: WatchesClientPageProps) {
  // State กลางสำหรับ Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);

  const tableColumns = getColumns({ 
    userRole, 
    suppliers: initialSuppliers,
    onEdit: (watch: Watch) => {
      setSelectedWatch(watch);
      setEditDialogOpen(true);
    },
    onViewMedia: (watch: Watch) => {
      setSelectedWatch(watch);
      setMediaDialogOpen(true);
    }
  });
  const canModify = userRole === 'admin' || userRole === 'marketing';

  return (
    <div className="container mx-auto py-10 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Watch Inventory</h1>
        {canModify && (
          <WatchFormDialog suppliers={initialSuppliers} userRole={userRole} />
        )}
      </div>
      <DataTable columns={tableColumns} data={initialWatches} userRole={userRole} suppliers={initialSuppliers} />
      {/* Dialogs */}
      <WatchFormDialog
        suppliers={initialSuppliers}
        userRole={userRole}
        watch={selectedWatch || undefined}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        trigger={null}
      />
      <ImageViewerDialog
        mediaUrls={selectedWatch?.media?.map(m => m.url) || []}
        watchRef={selectedWatch?.ref || ''}
        open={mediaDialogOpen}
        onOpenChange={setMediaDialogOpen}
      />
    </div>
  )
}