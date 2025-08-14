'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getReceiptData } from '../../actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReceiptButtonProps {
    invoiceId: number;
}

export default function ReceiptGeneratorButton({ invoiceId }: ReceiptButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const generatePDF = async () => {
        setIsLoading(true);
        toast.info("Generating PDF, please wait...");
        
        const result = await getReceiptData(invoiceId);

        if (!result.success || !result.data) {
            toast.error("Failed to fetch receipt data", { description: result.error });
            setIsLoading(false);
            return;
        }

        const { data: receipt } = result;
        const doc = new jsPDF();
        
        try {
            const fontResponse = await fetch('/Kanit-Regular.ttf');
            const font = await fontResponse.arrayBuffer();
            const fontBase64 = btoa(new Uint8Array(font).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            
            const logoResponse = await fetch('/logo.png');
            const logoBlob = await logoResponse.blob();
            const logoUrl = URL.createObjectURL(logoBlob);
            
            doc.addFileToVFS("Kanit-Regular.ttf", fontBase64);
            doc.addFont("Kanit-Regular.ttf", "Kanit", "normal");
            doc.setFont("Kanit");

            const img = new Image();
            img.src = logoUrl;
            await new Promise(resolve => { img.onload = resolve; });

            const logoWidth = 50;
            const logoHeight = (img.height * logoWidth) / img.width;
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.addImage(logoUrl, 'PNG', (pageWidth / 2) - (logoWidth / 2), 15, logoWidth, logoHeight);

            doc.setFontSize(22);
            doc.text("ใบเสร็จรับเงิน / Receipt", pageWidth / 2, 25 + logoHeight, { align: 'center' });
            
            const startY = 35 + logoHeight;
            doc.setFontSize(10);
            doc.text(`เลขที่ใบเสร็จ (Invoice No): INV-${String(receipt.id).padStart(6, '0')}`, 14, startY);
            doc.text(`วันที่ (Date): ${new Date(receipt.sale_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric'})}`, 14, startY + 6);
            
            doc.text("ข้อมูลผู้ซื้อ (Buyer Information):", 14, startY + 16);
            doc.text(receipt.customers?.full_name || '-', 14, startY + 22);
            doc.text(receipt.customers?.address || '', 14, startY + 28);

            const description = `${receipt.watches.brand || '-'} ${receipt.watches.model || ''} (Ref: ${receipt.watches.ref || '-'})`;
            const serialNo = receipt.watches.serial_no || '-';
            const condition = `${receipt.watches.product_type || '-'} / ${receipt.watches.set_type || '-'}`;
            const price = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(receipt.sale_price);

            autoTable(doc, {
                startY: startY + 40,
                head: [['รายการ (Description)', 'Serial No.', 'สภาพ (Condition)', 'ราคา (Price)']],
                body: [[description, serialNo, condition, price]],
                theme: 'grid',
                headStyles: { font: 'Kanit', fillColor: [30, 30, 30] },
                bodyStyles: { font: 'Kanit', valign: 'middle' },
                columnStyles: { 3: { halign: 'right' } }
            });

            let finalY = 0;
            if (
                typeof (doc as unknown) === 'object' &&
                doc !== null &&
                'lastAutoTable' in doc &&
                typeof (doc as { lastAutoTable?: unknown }).lastAutoTable === 'object' &&
                (doc as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY !== undefined
            ) {
                finalY = (doc as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
            }

            doc.setFontSize(10);
            doc.text("ผู้ขาย (Seller):", 14, finalY + 15);
            doc.text(`Chronos Watch (${receipt.seller_email || '-'})`, 14, finalY + 20);

            doc.setFontSize(8);
            doc.text("หมายเหตุ: สินค้าที่ซื้อไปแล้วไม่รับเปลี่ยนหรือคืนในทุกกรณี (All sales are final, no returns or exchanges.)", pageWidth / 2, finalY + 40, { align: 'center' });

            doc.save(`Receipt-INV-${String(receipt.id).padStart(6, '0')}.pdf`);

        } catch (error) {
            toast.error("Failed to generate PDF.", { description: error instanceof Error ? error.message : "Could not load required assets like font or logo." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            onClick={generatePDF} 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
            className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-[#E6C36A] hover:border-[#E6C36A] transition-all rounded-lg"
        >
            <FileText className="mr-2 h-3.5 w-3.5" />
            {isLoading ? 'Generating...' : 'Receipt'}
        </Button>
    );
}