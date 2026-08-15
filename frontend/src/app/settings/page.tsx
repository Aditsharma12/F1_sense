"use client";

import React from "react";
import { useF1Sense } from "@/context/F1SenseContext";
import { Server, Settings, Info, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { apiOnline, getApiBase } = useF1Sense();
  const apiBase = getApiBase();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-2 text-gray-800 mb-6 border-b border-[#e0d9cc] pb-2">
        <Settings className="w-5 h-5 text-[#ff5500]" />
        <h2 className="text-lg font-bold uppercase tracking-wider">System Settings</h2>
      </div>

      {/* Backend Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest flex items-center mb-4">
          <Server className="w-4 h-4 mr-2 text-[#0088cc]" />
          Backend Connection
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#f8f5f0] border border-[#e0d9cc] rounded-lg">
            <span className="font-semibold text-gray-700">Status</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className={`font-bold ${apiOnline ? 'text-emerald-700' : 'text-red-700'}`}>
                {apiOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#f8f5f0] border border-[#e0d9cc] rounded-lg">
            <span className="font-semibold text-gray-700">API Endpoint</span>
            <span className="font-mono text-sm bg-white px-2 py-1 border border-gray-200 rounded text-gray-800">
              {apiBase}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest flex items-center mb-4">
          <Monitor className="w-4 h-4 mr-2 text-[#0088cc]" />
          Dashboard Preferences
        </h3>
        <div className="space-y-4 text-sm text-gray-600">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#ff5500] focus:ring-[#ff5500]" />
            <span className="font-medium text-gray-800">Enable UI Animations</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#ff5500] focus:ring-[#ff5500]" />
            <span className="font-medium text-gray-800">Auto-analyze on telemetry changes</span>
          </label>
          <p className="text-xs italic mt-2 opacity-70">
            Note: Preferences are stored locally in your browser.
          </p>
        </div>
      </div>

      {/* Application Info */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest flex items-center mb-4">
          <Info className="w-4 h-4 mr-2 text-[#0088cc]" />
          Application Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-[#f8f5f0] border border-[#e0d9cc] rounded-lg">
            <div className="text-gray-500 text-xs uppercase mb-1">Version</div>
            <div className="font-bold text-gray-900 font-mono">v0.1.0-alpha</div>
          </div>
          <div className="p-3 bg-[#f8f5f0] border border-[#e0d9cc] rounded-lg">
            <div className="text-gray-500 text-xs uppercase mb-1">Engine</div>
            <div className="font-bold text-gray-900 font-mono">Wav2Vec2 + Whisper</div>
          </div>
          <div className="p-3 bg-[#f8f5f0] border border-[#e0d9cc] rounded-lg">
            <div className="text-gray-500 text-xs uppercase mb-1">Telemetry Sync</div>
            <div className="font-bold text-gray-900 font-mono">10Hz Simulation</div>
          </div>
          <div className="p-3 bg-[#f8f5f0] border border-[#e0d9cc] rounded-lg">
            <div className="text-gray-500 text-xs uppercase mb-1">Environment</div>
            <div className="font-bold text-gray-900 font-mono">Development</div>
          </div>
        </div>
      </div>
    </div>
  );
}
