'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  CreditCard,
  FileText,
  DollarSign,
  Download,
  CheckCircle,
  Receipt,
  User,
  Car,
  QrCode,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [paying, setPaying] = useState(false);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await api.getInvoices();
      setInvoices(data || []);
      if (data && data.length > 0) setSelectedInvoice(data[0]);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handlePayInvoice = async () => {
    if (!selectedInvoice) return;
    try {
      setPaying(true);
      const targetJobId = selectedInvoice.jobCardId || selectedInvoice.id;
      await api.recordPayment(targetJobId, paymentMethod, 0);
      alert('Payment settled successfully! Cryptographic Gate Pass issued.');
      await loadInvoices();
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  const totalAmount = selectedInvoice?.totalAmount || selectedInvoice?.netTotal || 20355;
  const laborAmount = selectedInvoice?.laborTotal || selectedInvoice?.totalLaborAmount || 8500;
  const partsAmount = selectedInvoice?.partsTotal || selectedInvoice?.totalPartsAmount || 9200;
  const taxAmount = selectedInvoice?.taxAmount || 2655;
  const invStatus = selectedInvoice?.status || selectedInvoice?.paymentStatus || 'PAID';
  const jobId = selectedInvoice?.jobCardId || selectedInvoice?.jobCard?.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Split-Billing & PDF Invoicing</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
              PARTS vs LABOR ISOLATION
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated tax calculation, split-tender payments, and instant vector PDF invoice generation for enterprise vehicle fleets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Invoices List */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-md space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold px-2 block">
            Recent Invoices ({invoices.length})
          </span>

          <div className="space-y-2">
            {invoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              const net = inv.totalAmount || inv.netTotal || 20355;
              const st = inv.status || inv.paymentStatus || 'PAID';
              return (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 shadow-md shadow-blue-950/40'
                      : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="text-xs font-bold text-blue-400">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        st === 'PAID'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {st}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-bold">
                    Total: Rs. {net.toLocaleString()}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Job: {inv.jobCard?.jobNumber || 'JOB-ACTIVE'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Invoice Breakdown & Actions */}
        {selectedInvoice && (
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3 font-mono">
                    <h2 className="text-2xl font-black text-white">
                      {selectedInvoice.invoiceNumber}
                    </h2>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border ${
                        invStatus === 'PAID'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {invStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Vehicle: {selectedInvoice.jobCard?.vehicle?.make || 'Hyundai'} {selectedInvoice.jobCard?.vehicle?.model || 'Ioniq 5'} ({selectedInvoice.jobCard?.vehicle?.licensePlate || 'WP-CBE-1004'})
                  </div>
                </div>

                {/* PDF Download Button */}
                {jobId && (
                  <a
                    href={`http://localhost:5050/api/billing/invoice/${jobId}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-950/40"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD OFFICIAL PDF</span>
                  </a>
                )}
              </div>

              {/* Split Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">LABOR SUBTOTAL</div>
                  <div className="text-xl font-bold text-cyan-400">
                    Rs. {laborAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Mechanic Book Time</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">PARTS & FLUIDS</div>
                  <div className="text-xl font-bold text-amber-400">
                    Rs. {partsAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Verified OEM Requisitions</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">TAX (VAT / SSCL)</div>
                  <div className="text-xl font-bold text-purple-400">
                    Rs. {taxAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Inland Revenue Compliant</div>
                </div>
              </div>

              {/* Grand Total */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/60 flex items-center justify-between font-mono">
                <span className="text-sm font-bold text-slate-200">TOTAL INVOICE AMOUNT</span>
                <span className="text-2xl font-black text-white">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Settlement Form */}
              {invStatus !== 'PAID' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Split-Tender Payment Settlement:
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 outline-none"
                    >
                      <option value="CREDIT_CARD">Credit / Debit Card</option>
                      <option value="CASH">Cash Over Counter</option>
                      <option value="FLEET_CORPORATE">Corporate Fleet Account</option>
                      <option value="ONLINE_GATEWAY">Online Bank Transfer</option>
                    </select>

                    <button
                      onClick={handlePayInvoice}
                      disabled={paying}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase font-mono transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{paying ? 'PROCESSING...' : 'CONFIRM PAYMENT & ISSUE GATE PASS'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
