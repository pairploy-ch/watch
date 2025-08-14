'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from 'sonner';
import { addHistoricalPurchase } from '../../actions';
import { Customer, Watch } from '@/lib/types';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddPurchaseProps {
  customer: Customer;
  allWatches: Partial<Watch>[];
}

type PurchaseFormData = {
  watch_id: number;
  sale_price: number;
  sale_date: string;
}

export default function AddPurchaseDialog({ customer, allWatches }: AddPurchaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState<Partial<Watch> | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<PurchaseFormData>({
    defaultValues: {
      sale_date: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: PurchaseFormData) => {
    if (!selectedWatch || !selectedWatch.id) {
        toast.error("Please select a watch.");
        return;
    }

    const result = await addHistoricalPurchase({
        ...data,
        customer_id: customer.id,
        watch_id: selectedWatch.id,
    });

    if (result.success) {
        toast.success("Purchase record added successfully!");
        setIsOpen(false);
        reset();
        setSelectedWatch(null);
    } else {
        toast.error("Failed to add record", { description: result.error });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gold-bg text-black font-bold rounded-lg">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Purchase Record
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white sm:max-w-md rounded-xl shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl"></div>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#E6C36A]">Add Purchase to: {customer.full_name}</DialogTitle>
          <DialogDescription className="text-gray-400">Select a watch and enter the sale details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div>
            <Label className="text-gray-300">Watch (Brand & Ref)</Label>
            <Popover open={isListOpen} onOpenChange={setIsListOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white rounded-lg">
                  {selectedWatch ? `${selectedWatch.brand} - ${selectedWatch.ref}` : "Select watch..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-gray-800 border-gray-700">
                <Command className="bg-gray-800">
                  <CommandInput placeholder="Search watch..." className="text-white placeholder-gray-400" />
                  <CommandEmpty className="text-gray-400">No watch found.</CommandEmpty>
                  <CommandList>
                    {allWatches.map((watch) => (
                      <CommandItem key={watch.id} value={`${watch.brand} ${watch.ref}`} onSelect={() => { 
                        setSelectedWatch(watch); 
                        setValue("watch_id", watch.id!);
                        setIsListOpen(false); 
                      }} className="text-gray-200 hover:bg-gray-700">
                        <Check className={cn("mr-2 h-4 w-4", selectedWatch?.id === watch.id ? "opacity-100" : "opacity-0")} />
                        {watch.brand} - {watch.ref}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-gray-300">Sale Price (THB)</Label>
            <Input 
              type="number" 
              step="0.01" 
              {...register("sale_price", { required: true, valueAsNumber: true })} 
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg" 
            />
          </div>
          <div>
            <Label className="text-gray-300">Sale Date</Label>
            <Input 
              type="date" 
              {...register("sale_date", { required: true })} 
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white rounded-lg" 
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" className="gold-bg text-black font-bold rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}