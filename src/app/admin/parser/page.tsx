// src/app/admin/ai-parser-page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Watch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type ParsedData = Partial<Omit<Watch, 'id' | 'created_at' | 'updated_at'>> & {
  _created?: boolean;
  images_url?: string[];
  video_url?: string | null;
};

type MarketDataDialogProps = {
  marketData: ParsedData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

function MarketDataDialog({ marketData, isOpen, onOpenChange, onSaved }: MarketDataDialogProps) {
  const [formData, setFormData] = useState(marketData);
  const [isSaving, setIsSaving] = useState(false);
  const [touched, setTouched] = useState<{ brand?: boolean; ref?: boolean; selling_price?: boolean }>({});

  useEffect(() => {
    setFormData(marketData);
    setTouched({});
  }, [marketData]);

  // Validation
  const errors = {
    brand: !formData.brand ? 'Brand is required' : '',
    ref: !formData.ref ? 'Reference is required' : '',
    selling_price: !formData.selling_price ? 'Price is required' : '',
  };
  const isValid = !errors.brand && !errors.ref && !errors.selling_price;

  const handleSave = async () => {
    setTouched({ brand: true, ref: true, selling_price: true });
    if (!isValid) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน: ' + Object.entries(errors).filter(([, v]) => v).map(([, v]) => v).join(', '));
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/market-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: formData.brand,
          ref: formData.ref,
          model: formData.model,
          watch_year: formData.watch_year,
          product_type: formData.product_type,
          set_type: formData.set_type,
          selling_price: formData.selling_price,
          currency: formData.currency || 'THB',
          notes: formData.notes,
          source_text: marketData.notes // Store original text as source
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save market data');
      }

      toast.success('Market data saved successfully');
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save market data', { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white sm:max-w-md rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#E6C36A]">Save Market Data</DialogTitle>
          <DialogDescription className="text-gray-400">
            Review and save this market price data for analysis.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div>
            <Label className="text-gray-300">Brand *</Label>
            <Input
              value={formData.brand || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, brand: true }))}
              placeholder="Enter brand"
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg"
            />
            {touched.brand && errors.brand && <div className="text-red-400 text-xs mt-1">{errors.brand}</div>}
          </div>
          
          <div>
            <Label className="text-gray-300">Reference *</Label>
            <Input
              value={formData.ref || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, ref: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, ref: true }))}
              placeholder="Enter reference"
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg"
            />
            {touched.ref && errors.ref && <div className="text-red-400 text-xs mt-1">{errors.ref}</div>}
          </div>
          
          <div>
            <Label className="text-gray-300">Model</Label>
            <Input
              value={formData.model || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Enter model"
              className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg"
            />
          </div>
          
                      <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Year</Label>
                <Input
                  type="number"
                  value={formData.watch_year || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, watch_year: e.target.value ? parseInt(e.target.value) : null }))}
                  placeholder="Year"
                  className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Price *</Label>
                <Input
                  type="number"
                  value={formData.selling_price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value ? parseFloat(e.target.value) : null }))}
                  onBlur={() => setTouched(t => ({ ...t, selling_price: true }))}
                  placeholder="Price"
                  className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg"
                />
                {touched.selling_price && errors.selling_price && <div className="text-red-400 text-xs mt-1">{errors.selling_price}</div>}
              </div>
            </div>
          
                      <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Condition</Label>
                <Select value={formData.product_type || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, product_type: value as Watch['product_type'] }))}>
                  <SelectTrigger className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white rounded-lg">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="New" className="hover:bg-gray-700">New</SelectItem>
                    <SelectItem value="Used" className="hover:bg-gray-700">Used</SelectItem>
                    <SelectItem value="Vintage" className="hover:bg-gray-700">Vintage</SelectItem>
                    <SelectItem value="NOS" className="hover:bg-gray-700">NOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-gray-300">Set Type</Label>
                <Select value={typeof formData.set_type === 'string' ? formData.set_type : ''} onValueChange={(value) => setFormData(prev => ({ ...prev, set_type: value as unknown as Watch['set_type'] }))}>
                  <SelectTrigger className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white rounded-lg">
                    <SelectValue placeholder="Select set type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Full Set" className="hover:bg-gray-700">Full Set</SelectItem>
                    <SelectItem value="Watch only" className="hover:bg-gray-700">Watch only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          
                      <div>
              <Label className="text-gray-300">Notes</Label>
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes"
                className="bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg"
                rows={3}
              />
            </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-300 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gold-bg text-black font-bold rounded-lg">
            {isSaving ? 'Saving...' : 'Save Market Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AIParserPage() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedWatches, setParsedWatches] = useState<ParsedData[]>([]);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLogVisible, setIsLogVisible] = useState(false);
  const [reviewingData, setReviewingData] = useState<ParsedData | null>(null);
  const [reviewingIndex, setReviewingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invalidIndexes, setInvalidIndexes] = useState<number[]>([]);
  const saveAllBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchInitialData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Role is not used in this component, so we can remove the state
          await supabase.from('profiles').select('role').eq('id', user.id).single();
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load initial data');
      }
    };
    fetchInitialData();
  }, []);

  const handleParse = async () => {
    if (!inputText.trim()) {
      toast.warning('Please paste some text to parse.');
      return;
    }
    setIsLoading(true);
    setParsedWatches([]);
    setRawResponse(null);
    setIsError(false);
    setIsLogVisible(false);

    try {
      const response = await fetch('/api/parse-watch-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const result = await response.json();
      setRawResponse(JSON.stringify(result, null, 2));
      if (!response.ok) {
        setIsError(true);
        throw new Error(result.error || `API Error: ${response.status}`);
      }
      if (Array.isArray(result)) {
        setParsedWatches(result.map((watch: unknown) => ({ 
          ...watch as ParsedData, 
          images_url: (watch as ParsedData).images_url ?? [], 
          video_url: (watch as ParsedData).video_url ?? null 
        })));
        toast.success(`AI found ${result.length} watch(es).`);
      } else {
        setIsError(true);
        throw new Error('AI did not return a valid list of watches.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Parsing failed', { description: errorMessage });
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAndSave = (marketData: ParsedData, index: number) => {
    setReviewingData({ ...marketData });
    setReviewingIndex(index);
    setIsDialogOpen(true);
  };

  const handleReset = () => {
    setInputText('');
    setParsedWatches([]);
    setReviewingData(null);
    setReviewingIndex(null);
    setRawResponse(null);
    setIsError(false);
    setIsDialogOpen(false);
    toast.info('Parser has been reset.');
  };

  const onMarketDataSaved = () => {
    if (reviewingIndex !== null) {
      const updatedWatches = [...parsedWatches];
      updatedWatches[reviewingIndex]._created = true;
      setParsedWatches(updatedWatches);
    }
    setIsDialogOpen(false);
    toast.success('Market data saved successfully');
  };

  // Helper: ตรวจสอบข้อมูลครบ
  const isValidWatch = (w: ParsedData) => !!w.brand && !!w.ref && !!w.selling_price;

  // Save All handler
  const handleSaveAll = async () => {
    // หา index ที่ข้อมูลไม่ครบ
    const invalids: number[] = [];
    parsedWatches.forEach((w, idx) => {
      if (!w._created && !isValidWatch(w)) invalids.push(idx);
    });
    setInvalidIndexes(invalids);
    if (invalids.length > 0) {
      toast.error(`กรุณากรอกข้อมูลให้ครบถ้วนใน ${invalids.length} รายการก่อนบันทึกทั้งหมด`);
      // Scroll ไปที่รายการแรกที่ไม่ครบ
      setTimeout(() => {
        const el = document.getElementById(`market-row-${invalids[0]}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
      return;
    }
    // Save เฉพาะอันที่ยังไม่ _created และข้อมูลครบ
    setIsLoading(true);
    let successCount = 0;
    let failCount = 0;
    const updated = [...parsedWatches];
    for (let i = 0; i < parsedWatches.length; i++) {
      const w = parsedWatches[i];
      if (!w._created && isValidWatch(w)) {
        try {
          const response = await fetch('/api/market-prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brand: w.brand,
              ref: w.ref,
              model: w.model,
              watch_year: w.watch_year,
              product_type: w.product_type,
              set_type: w.set_type,
              selling_price: w.selling_price,
              currency: w.currency || 'THB',
              notes: w.notes,
              source_text: w.notes
            }),
          });
          if (response.ok) {
            updated[i]._created = true;
            successCount++;
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }
    }
    setParsedWatches(updated);
    setIsLoading(false);
    if (successCount > 0) toast.success(`บันทึกข้อมูลสำเร็จ ${successCount} รายการ`);
    if (failCount > 0) toast.error(`บันทึกข้อมูลบางรายการไม่สำเร็จ (${failCount})`);
  };

  const sampleText = `⌚5236P  2024 new HKD 638k
⌚5373P New 3/2025 HKD 4.74m 
⌚5990/1A grey 2018 used full set HKD 780k
🆕 142.055 2023y HKD1.63m
🆕 181.062 2025y HKD470k
🆕 182.086 2024y HKD370k
✅ 1205V/100A-B590 2021y HKD100k
✅ 1205V/000R-B591 2023y HKD100k
✅ 1205V/000R-B592 2021y HKD176k
🆕 4910/1200a green 2025y HKD115k
🆕 4947/1a-001 2024y HKD265k
🆕 4947r 2025y HKD380k
💰15510BC 2021Y HKD663K
💰15551ST Gray 5/2025 HKD408
💰15212NB 2024Y HKD434K
🔥F.P.Journe Resonance 2022y hkd3.10m
🔥F.P.Journe Octa Automatique hkd1.60m
🔥F.P.Journe Octa UTC Boutique Edition RG Auto 2013 hkd1.51m
🔥F.P.Journe Octa Reserve 2004y hkd1.58m 
🔥F.P.Journe Cqhronomtre Souverain 2023y hkd1.20m 
🔥F.P.Journe Elegante 2021y hkd643k

🔥🔥IN HK🔥🔥
Rm65-01 white tpt 10days to hk 4.6m hkd
Rm35-03 white 12/24 3.83m hkd`;

  return (
    <>
      <div className="container mx-auto py-10 text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Market Price Parser</h1>
            <p className="text-gray-400 mt-2">
              Parse market price data from text and save for analysis. This data is for market research only and won&apos;t be added to inventory.
            </p>
          </div>
          <Card className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-yellow-500" />
                Step 1: Input Market Data Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setInputText(sampleText)} className="border-[#E6C36A] text-[#E6C36A] hover:bg-[#E6C36A]/10 hover:border-[#E6C36A] transition-all rounded-lg text-xs font-semibold">
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInputText('')} className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-[#E6C36A] hover:border-[#E6C36A] transition-all rounded-lg text-xs font-semibold">
                  Clear
                </Button>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste market price listings here..."
                className="min-h-[180px] bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg text-base"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleParse}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full gold-bg text-black font-bold rounded-lg"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isLoading ? 'Processing...' : 'Parse Market Data with AI'}
                </Button>
              </div>
            </CardContent>
          </Card>
          {rawResponse && (
            <Card className={cn('relative border bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg', isError ? 'border-red-500' : 'border-gray-700')}> 
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {isError ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                      AI Response Log (for Debugging)
                    </CardTitle>
                    <CardDescription className="mt-1 text-gray-400">This is the raw data from the AI service. Click to view.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsLogVisible(!isLogVisible)} className="ml-4 text-gray-300 hover:text-[#E6C36A]">
                    {isLogVisible ? 'Hide' : 'Show'}
                    {isLogVisible ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {isLogVisible && (
                <CardContent>
                  <pre className="text-xs bg-black p-3 rounded-md overflow-x-auto">
                    <code>{rawResponse}</code>
                  </pre>
                </CardContent>
              )}
            </Card>
          )}
          {parsedWatches.length > 0 && (
            <Card className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Step 2: Review & Save Market Data ({parsedWatches.filter((w) => !w._created).length} remaining)
                </CardTitle>
                <div className="mt-3 flex gap-2">
                  <Button
                    ref={saveAllBtnRef}
                    onClick={handleSaveAll}
                    disabled={isLoading}
                    className="gold-bg text-black font-bold rounded-lg"
                  >
                    Save All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset} className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-[#E6C36A] hover:border-[#E6C36A] transition-all rounded-lg text-xs font-semibold">Reset</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {parsedWatches.map((watch, index) => {
                  const isInvalid = invalidIndexes.includes(index);
                  const missingFields = [];
                  if (!watch.brand) missingFields.push('Brand');
                  if (!watch.ref) missingFields.push('Reference');
                  if (!watch.selling_price) missingFields.push('Price');
                  return (
                    <div
                      key={index}
                      id={`market-row-${index}`}
                      className={cn('relative bg-gray-800/50 border rounded-lg p-4 flex justify-between items-center gap-4 group transition-all', isInvalid ? 'border-red-500' : 'border-gray-700', 'hover:border-[#E6C36A]/60')}
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-t-lg" />
                      <div className="flex-1">
                        <p className="font-bold text-lg">
                          {watch.brand || 'Unknown Brand'} {watch.model || watch.ref}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mt-1">
                          <span>
                            Ref: <span className="font-mono">{watch.ref || '-'}</span>
                          </span>
                          <span>Year: {watch.watch_year || '-'}</span>
                          <span>
                            Price:{' '}
                            {watch.selling_price ? `${watch.selling_price.toLocaleString()} ${watch.currency || 'THB'}` : '-'}
                          </span>
                          {!watch.brand && (
                            <span className="text-orange-400 font-medium">⚠️ Brand needs to be set</span>
                          )}
                        </div>
                        {isInvalid && (
                          <div className="text-red-400 text-xs mt-1">
                            ข้อมูลไม่ครบ: {missingFields.join(', ')}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => handleReviewAndSave(watch, index)}
                        disabled={watch._created}
                        className={cn('transition-colors gold-bg text-black font-bold rounded-lg', watch._created ? 'bg-green-700 hover:bg-green-600 text-white' : '')}
                      >
                        {watch._created ? <CheckCircle className="mr-2 h-4 w-4" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                        {watch._created ? 'Saved' : 'Review & Save'}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {reviewingData && (
        <MarketDataDialog
          marketData={reviewingData}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSaved={onMarketDataSaved}
        />
      )}
    </>
  );
}