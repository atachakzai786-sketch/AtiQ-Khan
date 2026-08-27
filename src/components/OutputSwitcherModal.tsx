import { useState } from 'react';
import { OutputDevice } from '../types';
import { MOCK_OUTPUT_DEVICES } from '../data/musicCatalog';
import { X, Smartphone, Headphones, Speaker, Radio, Check, Volume2, Sparkles, Cast } from 'lucide-react';

interface OutputSwitcherModalProps {
  onClose: () => void;
  currentVolume: number;
  onVolumeChange: (vol: number) => void;
}

export function OutputSwitcherModal({
  onClose,
  currentVolume,
  onVolumeChange,
}: OutputSwitcherModalProps) {
  const [devices, setDevices] = useState<OutputDevice[]>(MOCK_OUTPUT_DEVICES);

  const handleSelectDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        isActive: d.id === id,
      }))
    );
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'bluetooth':
        return <Headphones className="w-5 h-5 text-indigo-400" />;
      case 'airplay':
        return <Speaker className="w-5 h-5 text-sky-400" />;
      case 'cast':
        return <Cast className="w-5 h-5 text-emerald-400" />;
      default:
        return <Smartphone className="w-5 h-5 text-zinc-300" />;
    }
  };

  const activeDevice = devices.find((d) => d.isActive) || devices[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
      id="output-switcher-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#0F0F0F] border border-[#1F1F1F] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-[#F5F5F5] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
        id="output-switcher-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF6B35] animate-pulse" />
            <div>
              <h3 className="font-bold text-base text-[#F5F5F5]">Audio Output Device</h3>
              <p className="text-xs text-[#A0A0A0]">Stream seamlessly via Bluetooth & AirPlay 2</p>
            </div>
          </div>
          <button
            id="output-switcher-close-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#F5F5F5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Device Banner */}
        <div className="my-4 p-3.5 bg-gradient-to-r from-[#1C120F] to-[#141414] border border-[#FF6B35]/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF6B35]/20 text-[#FF6B35]">
              {getDeviceIcon(activeDevice.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF804D]">Connected</span>
                <Sparkles className="w-3 h-3 text-[#FF804D]" />
              </div>
              <p className="font-semibold text-sm text-[#F5F5F5]">{activeDevice.name}</p>
            </div>
          </div>
          {activeDevice.batteryLevel !== undefined && (
            <div className="text-right">
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                {activeDevice.batteryLevel}% 🔋
              </span>
            </div>
          )}
        </div>

        {/* Available Devices List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          <p className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider px-1 pt-1">
            Available Devices
          </p>
          {devices.map((device) => {
            const isSelected = device.isActive;
            return (
              <button
                key={device.id}
                id={`output-device-${device.id}`}
                onClick={() => handleSelectDevice(device.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition text-left ${
                  isSelected
                    ? 'bg-[#1A1A1A] border-[#FF6B35]/50 shadow-md'
                    : 'bg-[#080808] border-[#1F1F1F] hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#161616] text-[#A0A0A0]">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isSelected ? 'text-[#F5F5F5]' : 'text-[#A0A0A0]'}`}>
                      {device.name}
                    </p>
                    <p className="text-xs text-[#737373]">{device.details}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {device.batteryLevel !== undefined && (
                    <span className="text-xs text-[#737373] font-mono hidden sm:inline">
                      {device.batteryLevel}%
                    </span>
                  )}
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center text-[#080808]">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-[#333333] hover:border-[#555555]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Output Volume Slider */}
        <div className="mt-5 pt-4 border-t border-[#1F1F1F] space-y-2">
          <div className="flex justify-between text-xs text-[#A0A0A0]">
            <span className="flex items-center gap-1.5 font-medium">
              <Volume2 className="w-4 h-4 text-[#FF6B35]" /> Master Volume
            </span>
            <span className="font-mono">{Math.round(currentVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={currentVolume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-[#FF6B35] h-1.5 bg-[#1F1F1F] rounded-lg cursor-pointer"
            id="output-volume-slider"
          />
        </div>
      </div>
    </div>
  );
}
