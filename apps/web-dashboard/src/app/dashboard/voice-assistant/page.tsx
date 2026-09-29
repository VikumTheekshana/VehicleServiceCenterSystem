'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Mic,
  MicOff,
  Sparkles,
  Play,
  CheckCircle,
  FileText,
  Volume2,
  Wrench,
  Radio,
  Cpu,
  Layers
} from 'lucide-react';

const PRESET_VOICE_PROMPTS = [
  "Noticed front brake pads worn down to 3mm. Replaced front brake pads and refilled brake fluid dot 4.",
  "Drained engine oil, replaced oil filter and requisitioned 4 liters of synthetic 0W-20 engine oil.",
  "Suspension squeak diagnosed on left front lower arm bushing. Replaced control arm bushing and performed 3D wheel alignment.",
  "Battery health check completed. High voltage cell delta is 0.018 volts. Cleaned inverter coolant lines."
];

export default function VoiceAssistantPage() {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    api.getJobCards().then((data) => {
      setJobCards(data || []);
      if (data && data.length > 0) setSelectedJobId(data[0].id);
    });
  }, []);

  const handleSimulateRecording = (presetText: string) => {
    setIsRecording(true);
    setTranscript('');
    setResult(null);

    // Simulate speech-to-text typing stream
    let index = 0;
    const interval = setInterval(() => {
      setTranscript(presetText.slice(0, index));
      index += 3;
      if (index > presetText.length + 5) {
        clearInterval(interval);
        setTranscript(presetText);
        setIsRecording(false);
      }
    }, 40);
  };

  const handleSubmitVoiceNotes = async () => {
    if (!selectedJobId || !transcript) return;
    try {
      setProcessing(true);
      const res = await api.submitVoiceNotes(selectedJobId, transcript, true);
      setResult(res);
    } catch (err: any) {
      alert(`Voice processing failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Ambient Voice-to-Job Assistant</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
              WHISPER STT + LLM INTENT
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hands-free Bluetooth bone-conduction audio pipeline. Converts technician speech directly into labor book time & parts requisitions without touching greasy screens.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Selector & Audio Presets */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-md space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Select Target Active Job Card:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-500 outline-none"
            >
              {jobCards.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.jobNumber} - {j.vehicle?.licensePlate} ({j.vehicle?.model})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">
              Simulate Technician Headset Transcripts:
            </span>
            <div className="space-y-2">
              {PRESET_VOICE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSimulateRecording(prompt)}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/50 text-xs text-slate-300 font-mono transition group flex items-start gap-2.5"
                >
                  <Volume2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
                  <span className="line-clamp-2 italic">"{prompt}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Ambient Speech Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className={`w-5 h-5 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-purple-400'}`} />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  Ambient Speech Ingestion Buffer
                </h3>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isRecording
                    ? 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {isRecording ? 'LISTENING TO HEADSET...' : 'MIC READY'}
              </span>
            </div>

            {/* Speech Waveform / Display Box */}
            <div className="relative min-h-[140px] p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
              {transcript ? (
                <div className="space-y-2">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                    Speech-to-Text Transcription:
                  </span>
                  <p className="leading-relaxed text-sm text-cyan-200 italic">
                    "{transcript}"
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                  <Mic className="w-8 h-8 text-slate-700 mb-2" />
                  <span>Click one of the headset presets on the left or type your technician observation</span>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setTranscript('')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition"
              >
                CLEAR BUFFER
              </button>

              <button
                onClick={handleSubmitVoiceNotes}
                disabled={!transcript || processing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-purple-950/40 disabled:opacity-40"
              >
                <Sparkles className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                <span>{processing ? 'PARSING INTENT WITH LLM...' : 'AUTO-CREATE JOB ITEMS'}</span>
              </button>
            </div>
          </div>

          {/* Parsed Output Result */}
          {result && (
            <div className="rounded-2xl bg-emerald-950/20 border border-emerald-800/80 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between text-emerald-400 font-mono text-xs font-bold">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  AUTOOS INTENT PARSER SUCCESSFUL
                </span>
                <span>JOB UPDATED</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400 font-bold">Technician Voice Notes Saved:</div>
                <div className="text-slate-200 italic">"{result.technicianVoiceNotes}"</div>
              </div>

              <div className="text-xs font-mono text-emerald-300">
                &check; Auto-dispatched WebSocket update to Bay Monitor and Advisor Portal.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
