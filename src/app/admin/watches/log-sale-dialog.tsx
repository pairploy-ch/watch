'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { finalizeSaleAction } from './actions'
import { Watch, Customer } from '@/lib/types'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from '@/lib/supabase/client';
import CustomerFormDialog from '../customers/customer-form-dialog';
import * as Tone from 'tone';

interface LogSaleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  watch: Watch;
}

type SaleFormData = { final_sale_price: number; }

export default function LogSaleDialog({ isOpen, onOpenChange, watch }: LogSaleDialogProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SaleFormData>({
    defaultValues: { final_sale_price: watch.selling_price ?? 0 }
  });

  const synth = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    synth.current = new Tone.Synth().toDestination();

    if (isOpen) {
      const playSound = async () => {
          if (Tone.context.state !== 'running') {
              await Tone.start();
          }
          synth.current?.triggerAttackRelease("E5", "8n", Tone.now());
      }
      playSound();

      const fetchCustomers = async () => {
        const supabase = createClient();
        const { data } = await supabase.from('customers').select('*');
        setCustomers(data || []);
      };
      fetchCustomers();
    }
  }, [isOpen]);

  const onSubmit = async (data: SaleFormData) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer.");
      return;
    }
    
    const result = await finalizeSaleAction(
        { ...watch, ...data, customer_id: selectedCustomer.id },
        watch.id
    );

    if (result.success) {
      toast.success("Sale logged successfully!");
      onOpenChange(false);
    } else {
      toast.error("Failed to log sale", { description: result.error });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#121212] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="gold-text">Log Sale: {watch.brand} {watch.ref}</DialogTitle>
          <div className="!mt-4 p-4 bg-amber-900/50 border border-amber-700 rounded-lg flex items-start space-x-3">
              <Video className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                  <h4 className="font-bold text-amber-300">Important Reminder</h4>
                  <p className="text-sm text-amber-400">อย่าลืมถ่ายวิดีโอสภาพนาฬิกาและขั้นตอนการแพ็คสินค้าก่อนจัดส่งทุกครั้ง</p>
              </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div>
            <Label>Select or Add Customer</Label>
             <Popover open={isCustomerListOpen} onOpenChange={setIsCustomerListOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={isCustomerListOpen} className="w-full justify-between bg-gray-800">
                  {selectedCustomer ? selectedCustomer.full_name : "Select customer..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search customer..." />
                  <CommandEmpty>No customer found. <CustomerFormDialog trigger="Add New" /></CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                    {customers.map((customer) => (
                      <CommandItem key={customer.id} value={customer.full_name} onSelect={() => { setSelectedCustomer(customer); setIsCustomerListOpen(false); }}>
                        <Check className={cn("mr-2 h-4 w-4", selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0")} />
                        {customer.full_name}
                      </CommandItem>
                    ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div><Label>Final Sale Price</Label><Input type="number" step="0.01" {...register("final_sale_price", { required: true, valueAsNumber: true })} className="bg-gray-800" /></div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="gold-bg text-black font-bold" disabled={isSubmitting}>{isSubmitting ? 'Logging...' : 'Log Sale'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}