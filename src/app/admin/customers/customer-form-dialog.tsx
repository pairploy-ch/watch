'use client'

import { useState, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createOrUpdateCustomer } from './actions';
import { Customer } from '@/lib/types';

interface CustomerFormProps {
  customer?: Customer;
  trigger?: ReactNode;
}

export default function CustomerFormDialog({ customer, trigger = "Add New Customer" }: CustomerFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Omit<Customer, 'id' | 'created_at'>>({ defaultValues: customer });

  const onSubmit = async (data: Omit<Customer, 'id' | 'created_at'>) => {
    const result = await createOrUpdateCustomer(data, customer?.id);
    if (result.success) {
      toast.success(`Customer ${customer ? 'updated' : 'created'} successfully.`);
      setIsOpen(false);
      reset();
    } else {
      toast.error("Failed to save customer", { description: result.error });
    }
  };

  let triggerButton: ReactNode;
  if (typeof trigger === 'string') {
    triggerButton = trigger === 'Edit Customer'
      ? <span className="w-full text-left relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">{trigger}</span>
      : <Button className={'gold-bg text-black font-bold'}>{trigger}</Button>;
  } else {
    triggerButton = trigger;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white sm:max-w-md rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#E6C36A]">{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
            <Input id="full_name" {...register("full_name", { required: true })} className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-300">Phone</Label>
            <Input id="phone" {...register("phone")}
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg" />
          </div>
          <div>
            <Label htmlFor="social_contact" className="text-gray-300">LINE / WhatsApp ID</Label>
            <Input id="social_contact" {...register("social_contact")}
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg" />
          </div>
          <div>
            <Label htmlFor="address" className="text-gray-300">Address</Label>
            <Textarea id="address" {...register("address")}
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="gold-bg text-black font-bold rounded-lg">
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}