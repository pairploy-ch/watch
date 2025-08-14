"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditNoteDialog({ watchId, initialNote }: { watchId: number, initialNote: string | null | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(initialNote || '');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch(`/api/admin/watches/${watchId}/note`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: note })
    });
    if (res.ok) {
      toast.success('Note updated');
      router.refresh();
      setIsOpen(false);
    } else {
      toast.error('Failed to update note');
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="ml-2 border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-[#E6C36A] transition-all rounded-lg">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white sm:max-w-md rounded-xl shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl"></div>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#E6C36A]">Edit Note</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the note for this watch. Leave empty to remove the note.
          </DialogDescription>
        </DialogHeader>
        <Input 
          value={note} 
          onChange={e => setNote(e.target.value)} 
          className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg" 
          placeholder="Enter note..."
        />
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="ghost" className="text-gray-300 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gold-bg text-black font-bold rounded-lg">
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 