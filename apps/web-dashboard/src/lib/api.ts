const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

export async function fetchFromApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorBody}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => fetchFromApi('/health'),

  // Workshop Bays
  getBays: () => fetchFromApi('/bays'),
  rebalanceBays: () => fetchFromApi('/bays/rebalance', { method: 'POST' }),
  assignBay: (jobId: string, bayId: string) =>
    fetchFromApi(`/bays/${bayId}/assign/${jobId}`, { method: 'POST' }),

  // Job Cards
  getJobCards: () => fetchFromApi('/job-cards'),
  getJobCardById: (id: string) => fetchFromApi(`/job-cards/${id}`),
  updateJobCardStatus: (id: string, status: string) =>
    fetchFromApi(`/job-cards/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  submitVoiceNotes: (id: string, voiceNotes: string, autoGenerateItems = true) =>
    fetchFromApi(`/job-cards/${id}/voice-notes`, {
      method: 'POST',
      body: JSON.stringify({ voiceNotes, autoGenerateItems }),
    }),

  // AI Damage Inspections
  getInspections: () => fetchFromApi('/inspections'),
  getInspectionById: (id: string) => fetchFromApi(`/inspections/${id}`),
  createInspection: (data: any) =>
    fetchFromApi('/inspections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Inventory & Bulk Fluids
  getInventory: () => fetchFromApi('/inventory'),
  getFluids: () => fetchFromApi('/inventory/fluids'),

  // IoT Zero-Theft Fluid Dispenser
  getDispenseLogs: () => fetchFromApi('/iot-dispensing/logs'),
  requestDispenseUnlock: (data: {
    jobCardId: string;
    drumId: string;
    targetVolumeLiters: number;
    technicianId: string;
  }) =>
    fetchFromApi('/iot-dispensing/request-unlock', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  recordDispensePulses: (data: {
    logId: string;
    pulseCount: number;
    actualVolumeLiters: number;
  }) =>
    fetchFromApi('/iot-dispensing/record-pulses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // EV Battery Passports
  getBatteryPassports: () => fetchFromApi('/ev-battery'),
  getBatteryPassportByVehicle: (vehicleId: string) =>
    fetchFromApi(`/ev-battery/vehicle/${vehicleId}`),
  createBatteryPassport: (data: any) =>
    fetchFromApi('/ev-battery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Billing & Invoices
  getInvoices: () => fetchFromApi('/billing/invoices'),
  getInvoiceById: (id: string) => fetchFromApi(`/billing/invoices/${id}`),
  recordPayment: (invoiceId: string, paymentMethod: string, amountPaid: number) =>
    fetchFromApi(`/billing/invoices/${invoiceId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod, amountPaid }),
    }),
  getInvoicePdfUrl: (invoiceId: string) =>
    `http://localhost:5050/api/billing/invoices/${invoiceId}/pdf`,

  // Gate Passes
  getGatePasses: () => fetchFromApi('/gate-passes'),
  verifyGatePass: (qrPayload: string, verifiedByOfficer: string) =>
    fetchFromApi('/gate-passes/verify', {
      method: 'POST',
      body: JSON.stringify({ qrPayload, verifiedByOfficer }),
    }),
  releaseBoomBarrier: (gatePassId: string) =>
    fetchFromApi(`/gate-passes/${gatePassId}/release`, {
      method: 'POST',
    }),
};
