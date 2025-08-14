'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Watch, Supplier, Customer, SetType } from '@/lib/types';
import { createOrUpdateWatch, finalizeSaleAction } from './actions';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Video, Trash2, Eye, Check, ChevronsUpDown, AlertTriangle, FilePlus2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import CustomerFormDialog from '../customers/customer-form-dialog';
import LogSaleDialog from './log-sale-dialog';
import * as Tone from 'tone';
import Image from 'next/image';

interface WatchFormDialogProps {
  suppliers: Supplier[];
  watch?: Partial<Watch>;
  trigger?: React.ReactNode;
  userRole?: 'admin' | 'marketing' | 'viewer' | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onWatchCreated?: () => void;
  className?: string;
}

type FormData = Omit<Watch, 'id' | 'created_at' | 'updated_at' | 'view_count'>;

// Default set type options
const SET_TYPE_OPTIONS = [
  { key: 'box', label: 'Box' },
  { key: 'card', label: 'Warranty Card' },
  { key: 'manual', label: 'User Manual' },
  { key: 'warranty', label: 'Warranty Papers' },
  { key: 'papers', label: 'Additional Papers' },
  { key: 'extra_links', label: 'Extra Bracelet Links' },
  { key: 'travel_case', label: 'Travel Case' },
];

export default function WatchFormDialog({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  suppliers,
  watch,
  trigger = 'Add New Watch',
  userRole,
  isOpen: controlledIsOpen,
  onOpenChange: setControlledIsOpen,
  onWatchCreated,
  className,
}: WatchFormDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = setControlledIsOpen ?? setInternalIsOpen;

  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isSaleLogOpen, setIsSaleLogOpen] = useState(false);
  const [soldWatch, setSoldWatch] = useState<Watch | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [finalSalePrice, setFinalSalePrice] = useState<number | null>(null);

  const synth = useRef<Tone.Synth | null>(null);
  useEffect(() => {
    synth.current = new Tone.Synth().toDestination();
  }, []);

  const supabase = createClient();
  const { control, register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      ...watch,
      is_public: watch?.is_public ?? false,
      currency: watch?.currency ?? 'THB',
      status: watch?.status ?? 'Available',
      set_type: watch?.set_type ?? {},
    } as FormData,
  });

  const statusValue = useWatch({ control, name: 'status' });
  const costPriceValue = useWatch({ control, name: 'cost_price' });
  const sellingPriceValue = useWatch({ control, name: 'selling_price' });
  const ownershipTypeValue = useWatch({ control, name: 'ownership_type' });
  const commissionRateValue = useWatch({ control, name: 'commission_rate' });

  // คำนวณ profit และ margin แบบ real-time สำหรับ preview
  const [profit, setProfit] = useState(0);
  const [marginPercent, setMarginPercent] = useState(0);
  const [profitStatus, setProfitStatus] = useState<'positive' | 'negative' | 'break_even' | 'commission' | 'unknown'>('unknown');

  useEffect(() => {
    const calculateProfitMargin = async () => {
      const cost = Number(costPriceValue) || 0;
      const selling = Number(sellingPriceValue) || 0;
      const ownershipType = ownershipTypeValue || 'stock';
      const commissionRate = Number(commissionRateValue) || 0;
      
      // สำหรับ Commission watches
      if (ownershipType === 'commission' && selling > 0 && commissionRate > 0) {
        const commissionAmount = (selling * commissionRate) / 100;
        setProfit(commissionAmount);
        setMarginPercent(commissionRate);
        setProfitStatus('commission');
      }
      // สำหรับ Stock watches
      else if (ownershipType === 'stock' && selling > 0 && cost > 0) {
        try {
          const response = await fetch('/api/admin/watches/calculate-profit-margin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selling_price: selling, cost_price: cost })
          });
          
          if (response.ok) {
            const result = await response.json();
            setProfit(result.profit || 0);
            setMarginPercent(result.margin_percent || 0);
            setProfitStatus(result.profit_status || 'unknown');
          } else {
            // Fallback to client-side calculation
            setProfit(selling - cost);
            setMarginPercent(((selling - cost) / selling) * 100);
            setProfitStatus(selling - cost > 0 ? 'positive' : selling - cost < 0 ? 'negative' : 'break_even');
          }
        } catch (error) {
          console.error('Error calculating profit/margin:', error);
          // Fallback to client-side calculation
          setProfit(selling - cost);
          setMarginPercent(((selling - cost) / selling) * 100);
          setProfitStatus(selling - cost > 0 ? 'positive' : selling - cost < 0 ? 'negative' : 'break_even');
        }
      } else {
        setProfit(0);
        setMarginPercent(0);
        setProfitStatus('unknown');
      }
    };

    calculateProfitMargin();
  }, [costPriceValue, sellingPriceValue, ownershipTypeValue, commissionRateValue]);

  useEffect(() => {
    if (isOpen) {
      const defaultVals = {
        ...watch,
        is_public: watch?.is_public ?? false,
        currency: watch?.currency ?? 'THB',
        status: watch?.status ?? 'Available',
        set_type: watch?.set_type ?? {},
        ownership_type: watch?.ownership_type ?? 'stock',
      };
      reset(defaultVals as FormData);
      setSelectedImages([]);
      setPreviewUrls([]);
      setSelectedVideo(null);
      setSelectedCustomer(null);
      setFinalSalePrice(null);

      if (userRole === 'admin') {
        const fetchCustomers = async () => {
          try {
            const { data } = await supabase.from('customers').select('*').order('full_name');
            setCustomers(data || []);
          } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to load customers');
          }
        };
        fetchCustomers();
      }

      // ดึง media เดิมมาแสดง
      const images = Array.isArray(watch?.media) ? watch.media.filter(m => m.type === 'image') : [];
      const videos = Array.isArray(watch?.media) ? watch.media.filter(m => m.type === 'video') : [];
      const existingImages = images.map(m => ({ url: m.url, id: m.id }));
      const existingVideo = videos.length > 0 ? { url: videos[0].url, id: videos[0].id } : null;
      setExistingImages(existingImages);
      setExistingVideo(existingVideo);
    }
  }, [isOpen, watch, reset, supabase, userRole]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
    }
  };

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };



  const onSubmit = async (data: FormData) => {
    console.log('Submitting data:', data, 'selectedCustomer:', selectedCustomer, 'finalSalePrice:', finalSalePrice);
    if (watch?.status === 'Sold' && data.status !== 'Sold') {
      const isConfirmed = confirm(
        'WARNING: This watch is already marked as SOLD.\n\nAre you sure you want to change its status? This action will be permanently logged.'
      );
      if (!isConfirmed) return;
    }

    setIsUploading(true);
    const newImageUrls: string[] = [];
    let newVideoUrl: string | null = null;

    try {
      for (const file of selectedImages) {
        const filePath = `public/${Date.now()}-${file.name}`;
        const { data: uploadData, error } = await supabase.storage.from('watch-images').upload(filePath, file);
        if (error) throw new Error('Image upload failed');
        newImageUrls.push(supabase.storage.from('watch-images').getPublicUrl(uploadData.path).data.publicUrl);
      }

      if (selectedVideo) {
        const videoPath = `public/${Date.now()}-${selectedVideo.name}`;
        const { data: uploadData, error } = await supabase.storage.from('watch-videos').upload(videoPath, selectedVideo);
        if (error) throw new Error('Video upload failed');
        newVideoUrl = supabase.storage.from('watch-videos').getPublicUrl(uploadData.path).data.publicUrl;
      }

      const finalData = { ...data };

      if (finalData.status === 'Sold' && watch?.status !== 'Sold') {
        if (!selectedCustomer) {
          toast.error('A customer must be selected to finalize a sale.');
          return;
        }
        if (!finalSalePrice || finalSalePrice <= 0) {
          toast.error('Final Sale Price is required.');
          return;
        }

        const result = await finalizeSaleAction(
          {
            ...finalData,
            customer_id: selectedCustomer.id,
            final_sale_price: finalSalePrice,
          },
          watch?.id ?? 0
        );
        if (result.success) {
          toast.success('Sale finalized!');
          setIsOpen(false);
          if (onWatchCreated) onWatchCreated();
        } else {
          toast.error('Failed to finalize sale', { description: result.error });
        }
      } else {
        // เตรียม media สำหรับ sync
        const allMedia: { url: string; type: 'image' | 'video'; position: number; id?: number }[] = [
          // media เดิมที่ยังไม่ถูกลบ
          ...existingImages.filter(img => !removedImageIds.includes(img.id!)).map(img => ({ url: img.url, type: 'image' as const, position: 0, ...(img.id ? { id: img.id } : {}) })),
          // media ใหม่
          ...newImageUrls.map((url) => ({ url, type: 'image' as const, position: 0 })),
        ];
        if (existingVideo && !removedVideoId) {
          allMedia.push({ url: existingVideo.url, type: 'video' as const, position: 0, ...(existingVideo.id ? { id: existingVideo.id } : {}) });
        }
        if (newVideoUrl) {
          allMedia.push({ url: newVideoUrl, type: 'video' as const, position: 0 });
        }
        // ส่ง allMedia ไปกับ createOrUpdateWatch(..., ..., allMedia)
        const result = await createOrUpdateWatch(finalData, watch?.id, allMedia);
        if (result.success) {
          toast.success(`Watch ${watch?.id ? 'updated' : 'created'} successfully!`);
          if (finalData.status === 'Sold' && result.data) {
            if (Tone.context.state !== 'running') await Tone.start();
            synth.current?.triggerAttackRelease('E5', '8n', Tone.now());
            setSoldWatch(result.data as Watch);
            setIsSaleLogOpen(true);
          }
          setIsOpen(false);
          if (onWatchCreated) onWatchCreated();
        } else {
          toast.error('Failed to save watch', { description: result.error });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while saving the watch');
    } finally {
      setIsUploading(false);
    }
  };

  const isFinalizingSale = statusValue === 'Sold' && watch?.status !== 'Sold';
  const isSaveDisabled = isSubmitting || isUploading || (isFinalizingSale && (!selectedCustomer || !finalSalePrice || finalSalePrice <= 0));

  const triggerElement = (
    <Button
      className={cn(
        (trigger === 'Add New Watch' || trigger === 'Create Watch from AI') && 'gold-bg text-black font-bold w-fit',
        trigger === 'Edit' &&
          'relative flex w-full justify-start cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-normal',
        className
      )}
      onClick={() => setIsOpen(true)}
      asChild={trigger === 'Edit'}
    >
      <span>
        {trigger === 'Create Watch from AI' ? (
          <>
            <FilePlus2 className='mr-2 h-4 w-4' />
            {trigger}
          </>
        ) : (
          trigger
        )}
      </span>
    </Button>
  );

  // เพิ่ม state สำหรับ media เดิม
  const [existingImages, setExistingImages] = useState<{url: string, id?: number}[]>([]);
  const [existingVideo, setExistingVideo] = useState<{url: string, id?: number} | null>(null);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [removedVideoId, setRemovedVideoId] = useState<number | null>(null);

  // ฟังก์ชันลบ media เดิม
  const removeExistingImage = (id?: number) => {
    if (!id) return;
    setRemovedImageIds(prev => [...prev, id]);
    setExistingImages(prev => prev.filter(img => img.id !== id));
  };
  const removeExistingVideo = (id?: number) => {
    if (!id) return;
    setRemovedVideoId(id);
    setExistingVideo(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger && (
          <DialogTrigger asChild>
            {triggerElement}
          </DialogTrigger>
        )}
        <DialogContent
          className='sm:max-w-4xl bg-[#121212] border-gray-700 text-white flex flex-col max-h-[90vh]'
          onOpenAutoFocus={e => e.preventDefault()}
          onCloseAutoFocus={e => e.preventDefault()}
        >
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle className='gold-text'>{watch?.id ? 'Edit Watch' : 'Add New Watch'}</DialogTitle>
          </DialogHeader>
          <div className='flex-grow overflow-y-auto pr-6 -mr-6'>
            <form id='watch-form' onSubmit={handleSubmit(onSubmit)}>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-4'>
                <div className='md:col-span-2 space-y-4'>
                  <div className='p-4 bg-gray-900/50 rounded-lg border border-gray-800 space-y-4'>
                    <h3 className='font-semibold text-amber-400'>Core Information</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label>Brand</Label>
                        <Input {...register('brand')} />
                      </div>
                      <div className='space-y-2'>
                        <Label>Model</Label>
                        <Input {...register('model')} />
                      </div>
                      <div className='space-y-2'>
                        <Label>Reference No.</Label>
                        <Input {...register('ref')} />
                      </div>
                      <div className='space-y-2'>
                        <Label>Serial No.</Label>
                        <Input {...register('serial_no')} />
                      </div>
                    </div>
                  </div>
                  <div className='p-4 bg-gray-900/50 rounded-lg border border-gray-800 space-y-4'>
                    <h3 className='font-semibold text-amber-400'>Specifications</h3>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                      <div className='space-y-2'>
                        <Label>Year</Label>
                        <Input type='number' {...register('watch_year', { valueAsNumber: true })} />
                      </div>
                      <div className='space-y-2'>
                        <Label>Size (mm)</Label>
                        <Input type='number' {...register('size_mm', { valueAsNumber: true })} />
                      </div>
                      <div className='space-y-2 col-span-2'>
                        <Label>Material</Label>
                        <Input {...register('material')} />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label>Product Type</Label>
                        <Controller
                          name='product_type'
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='New'>New</SelectItem>
                                <SelectItem value='Used'>Used</SelectItem>
                                <SelectItem value='Vintage'>Vintage</SelectItem>
                                <SelectItem value='NOS'>NOS</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Set Items</Label>
                        <Controller
                          name='set_type'
                          control={control}
                          render={({ field }) => (
                            <div className='grid grid-cols-2 gap-2 p-3 bg-gray-800 rounded-md max-h-32 overflow-y-auto'>
                              {SET_TYPE_OPTIONS.map((option) => (
                                <div key={option.key} className='flex items-center space-x-2'>
                                  <input
                                    type='checkbox'
                                    id={option.key}
                                    checked={field.value?.[option.key as keyof SetType] || false}
                                    onChange={(e) => {
                                      const newSetType = {
                                        ...field.value,
                                        [option.key]: e.target.checked,
                                      };
                                      field.onChange(newSetType);
                                    }}
                                    className='rounded border-gray-600 bg-gray-700 text-amber-400 focus:ring-amber-400'
                                  />
                                  <label htmlFor={option.key} className='text-sm capitalize'>
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='p-4 bg-gray-900/50 rounded-lg border border-gray-800 space-y-4'>
                    <h3 className='font-semibold text-amber-400'>Ownership & Pricing</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label>Ownership Type</Label>
                        <Controller
                          name='ownership_type'
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='stock'>Stock (ซื้อเข้า)</SelectItem>
                                <SelectItem value='commission'>Commission (ฝากขาย)</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Selling Price</Label>
                        <Input type='number' step='0.01' {...register('selling_price', { valueAsNumber: true })} />
                      </div>
                    </div>

                    {/* Conditional fields based on ownership type */}
                    {ownershipTypeValue === 'stock' && (
                      <div className='grid grid-cols-2 gap-4'>
                        {userRole === 'admin' && (
                          <div className='space-y-2'>
                            <Label>Cost Price</Label>
                            <Input type='number' step='0.01' {...register('cost_price', { valueAsNumber: true })} />
                          </div>
                        )}
                      </div>
                    )}

                    {ownershipTypeValue === 'commission' && (
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label>Commission Rate (%)</Label>
                          <Input type='number' step='0.01' {...register('commission_rate', { valueAsNumber: true })} />
                        </div>
                        <div className='space-y-2'>
                          <Label>Owner Name</Label>
                          <Input {...register('owner_name')} />
                        </div>
                        <div className='space-y-2'>
                          <Label>Owner Contact</Label>
                          <Input {...register('owner_contact')} />
                        </div>
                      </div>
                    )}

                    {/* Calculated Margin Display */}
                    {userRole === 'admin' && (
                      <div className='space-y-2 p-3 bg-gray-900 rounded-md'>
                        <Label className='text-gray-400'>
                          {ownershipTypeValue === 'commission' ? 'Commission Calculation' : 'Calculated Margin'}
                        </Label>
                        <div className='font-mono text-sm'>
                          <div>
                            <p>
                              {ownershipTypeValue === 'commission' ? 'Commission' : 'Profit'}: 
                              <span className={`${
                                profitStatus === 'commission' ? 'text-purple-400' :
                                profitStatus === 'positive' ? 'text-green-400' : 
                                profitStatus === 'negative' ? 'text-red-400' : 
                                profitStatus === 'break_even' ? 'text-yellow-400' : 
                                'text-gray-400'
                              }`}>
                                {profit.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
                              </span>
                            </p>
                            <p>
                              {ownershipTypeValue === 'commission' ? 'Commission Rate' : 'Margin'}: 
                              <span className={`${
                                profitStatus === 'commission' ? 'text-purple-400' :
                                profitStatus === 'positive' ? 'text-cyan-400' : 
                                profitStatus === 'negative' ? 'text-red-400' : 
                                profitStatus === 'break_even' ? 'text-yellow-400' : 
                                'text-gray-400'
                              }`}>
                                {marginPercent.toFixed(2)}%
                              </span>
                            </p>
                            <p>
                              Status: 
                              <span className={`${
                                profitStatus === 'commission' ? 'text-purple-400' :
                                profitStatus === 'positive' ? 'text-green-400' : 
                                profitStatus === 'negative' ? 'text-red-400' : 
                                profitStatus === 'break_even' ? 'text-yellow-400' : 
                                'text-gray-400'
                              }`}>
                                {profitStatus.toUpperCase()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label>Status</Label>
                        <Controller
                          name='status'
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='Available'>Available</SelectItem>
                                <SelectItem value='Reserved'>Reserved</SelectItem>
                                <SelectItem value='Sold'>Sold</SelectItem>
                                <SelectItem value='Hidden'>Hidden</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className='flex items-end pb-2'>
                        <Controller
                          name='is_public'
                          control={control}
                          render={({ field }) => (
                            <div className='flex items-center space-x-2'>
                              <Switch id='is_public' checked={field.value} onCheckedChange={field.onChange} />
                              <Label htmlFor='is_public'>Show on Public Site</Label>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='col-span-2 space-y-2'>
                    <Label>Notes</Label>
                    <Textarea {...register('notes')} />
                  </div>
                </div>
                <div className='space-y-4'>
                  <div>
                    <Label>Images</Label>
                    <div className='h-full w-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col p-4'>
                      <Input
                        id={`image-upload-${watch?.id || 'new'}`}
                        type='file'
                        multiple
                        onChange={handleFileChange}
                        className='hidden'
                        accept='image/png, image/jpeg, image/webp'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full border-gray-500'
                        onClick={() => document.getElementById(`image-upload-${watch?.id || 'new'}`)?.click()}
                      >
                        <Upload className='mr-2 h-4 w-4' /> Select Images
                      </Button>
                      <div className='w-full mt-4 grid grid-cols-3 gap-2'>
                        {/* แสดงรูปเดิม */}
                        {existingImages.filter(img => !removedImageIds.includes(img.id!)).map((img, index) => (
                          <div key={`existing-${img.id}`} className='relative group aspect-square'>
                            <Image
                              src={img.url}
                              alt={`Existing watch image ${index + 1}`}
                              width={100}
                              height={100}
                              className='w-full h-full object-cover rounded-md'
                            />
                            <button
                              type='button'
                              onClick={() => removeExistingImage(img.id)}
                              className='absolute top-1 right-1 bg-black/50 text-white rounded-full p-1'
                            >
                              <X className='h-4 w-4' />
                            </button>
                          </div>
                        ))}
                        {/* รูปใหม่ */}
                        {previewUrls.map((url, index) => (
                          <div key={`new-${index}`} className='relative group aspect-square'>
                            <Image
                              src={url}
                              alt={`New watch preview ${index + 1}`}
                              width={100}
                              height={100}
                              className='w-full h-full object-cover rounded-md'
                            />
                            <button
                              type='button'
                              onClick={() => removeNewImage(index)}
                              className='absolute top-1 right-1 bg-black/50 text-white rounded-full p-1'
                            >
                              <X className='h-4 w-4' />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Video</Label>
                    <div className='w-full border-2 border-dashed border-gray-600 rounded-lg p-4 space-y-3'>
                      {existingVideo && !removedVideoId && (
                        <div className='flex items-center justify-between bg-gray-800 p-2 rounded-md'>
                          <p className='text-sm text-cyan-400 truncate'>Current video present.</p>
                          <div className='flex items-center space-x-2'>
                            <a href={existingVideo.url} target='_blank' rel='noopener noreferrer' className='p-1.5 hover:bg-gray-700 rounded-full'>
                              <Eye className='h-4 w-4' />
                            </a>
                            <Button
                              type='button'
                              size='icon'
                              variant='ghost'
                              onClick={() => removeExistingVideo(existingVideo.id)}
                              className='h-7 w-7 text-red-500 hover:bg-red-900/50'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      )}
                      <Input
                        id={`video-upload-${watch?.id || 'new'}`}
                        type='file'
                        onChange={handleVideoChange}
                        className='hidden'
                        accept='video/mp4,video/quicktime'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full border-gray-500'
                        onClick={() => document.getElementById(`video-upload-${watch?.id || 'new'}`)?.click()}
                      >
                        <Video className='mr-2 h-4 w-4' /> {selectedVideo ? 'Change Video' : 'Select Video'}
                      </Button>
                      {selectedVideo && <p className='text-xs text-gray-400 truncate'>{selectedVideo.name}</p>}
                    </div>
                  </div>
                </div>
              </div>
              {isFinalizingSale && (
                <div className='mt-6 border-t-2 border-amber-500/50 pt-6 space-y-6'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-2xl font-bold text-amber-400'>Finalize Sale</h3>
                  </div>
                  <div className='p-4 bg-amber-900/50 border border-amber-700 rounded-lg flex items-start space-x-3'>
                    <AlertTriangle className='h-8 w-8 text-amber-400 flex-shrink-0 mt-1' />
                    <div>
                      <h4 className='font-bold text-amber-300'>ACTION REQUIRED: Final Steps</h4>
                      <p className='text-sm text-amber-400'>
                        1. Take a video of the watch condition and packaging.<br />
                        2. Select the buyer and confirm the final sale price below.
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Buyer * (Required)</Label>
                      <Popover open={isCustomerListOpen} onOpenChange={setIsCustomerListOpen}>
                        <PopoverTrigger asChild>
                          <Button variant='outline' role='combobox' className='w-full justify-between bg-gray-800'>
                            {selectedCustomer ? selectedCustomer.full_name : 'Select or add a customer...'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                          <Command>
                            <CommandInput placeholder='Search customer...' />
                            <CommandEmpty>
                              No customer found. <CustomerFormDialog trigger='Add New' />
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {customers.map((c) => (
                                  <CommandItem
                                    key={c.id}
                                    value={c.full_name}
                                    onSelect={() => {
                                      setSelectedCustomer(c);
                                      setIsCustomerListOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedCustomer?.id === c.id ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {c.full_name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='final_sale_price'>Final Sale Price (THB) *</Label>
                      <Input
                        id='final_sale_price'
                        type='number'
                        step='0.01'
                        value={finalSalePrice ?? ''}
                        onChange={(e) => setFinalSalePrice(e.target.value ? Number(e.target.value) : null)}
                        className='bg-gray-800'
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
          <DialogFooter className='flex-shrink-0 pt-4 border-t border-gray-800'>
            <Button type='button' variant='ghost' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' form='watch-form' className='gold-bg text-black font-bold' disabled={isSaveDisabled}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {soldWatch && <LogSaleDialog isOpen={isSaleLogOpen} onOpenChange={setIsSaleLogOpen} watch={soldWatch} />}
    </>
  );
}