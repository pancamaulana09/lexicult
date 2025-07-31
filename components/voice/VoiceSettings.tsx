'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Mic, 
  Volume2, 
  Headphones,
  Sliders,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

interface VoiceSettingsProps {
  isDarkMode?: boolean;
  themeClasses?: any;
  onSettingsChange?: (settings: VoiceSettings) => void;
}

interface VoiceSettings {
  inputDevice: string;
  outputDevice: string;
  sampleRate: number;
  bitRate: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  voiceActivation: boolean;
  sensitivity: number;
  outputVolume: number;
  language: string;
  accent: string;
  feedbackLevel: 'basic' | 'detailed' | 'expert';
}

interface AudioDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
}

export function VoiceSettings({
  isDarkMode = false,
  themeClasses,
  onSettingsChange
}: VoiceSettingsProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    inputDevice: 'default',
    outputDevice: 'default',
    sampleRate: 44100,
    bitRate: 128,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    voiceActivation: false,
    sensitivity: 50,
    outputVolume: 80,
    language: 'en-US',
    accent: 'american',
    feedbackLevel: 'detailed'
  });

  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [devicePermission, setDevicePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Load devices
  useEffect(() => {
    loadAudioDevices();
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setDevicePermission(permission.state);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const loadAudioDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = deviceList
        .filter(device => device.kind === 'audioinput' || device.kind === 'audiooutput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `${device.kind === 'audioinput' ? 'Microphone' : 'Speaker'} ${device.deviceId.slice(0, 5)}`,
          kind: device.kind as 'audioinput' | 'audiooutput'
        }));
      
      setDevices(audioDevices);
    } catch (error) {
      console.error('Error loading audio devices:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setDevicePermission('granted');
      loadAudioDevices();
    } catch (error) {
      setDevicePermission('denied');
      console.error('Permission denied:', error);
    }
  };

  const testMicrophone = async () => {
    setIsTestingMic(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: settings.inputDevice !== 'default' ? settings.inputDevice : undefined,
          echoCancellation: settings.echoCancellation,
          noiseSuppression: settings.noiseSuppression,
          autoGainControl: settings.autoGainControl,
          sampleRate: settings.sampleRate
        }
      });

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setMicLevel(average);

        if (isTestingMic) {
          requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();

      // Stop test after 5 seconds
      setTimeout(() => {
        setIsTestingMic(false);
        stream.getTracks().forEach(track => track.stop());
        setMicLevel(0);
      }, 5000);

    } catch (error) {
      console.error('Microphone test failed:', error);
      setIsTestingMic(false);
    }
  };

  const calibrateMicrophone = async () => {
    setIsCalibrating(true);
    
    // Simulate calibration process
    setTimeout(() => {
      setSettings(prev => ({
        ...prev,
        sensitivity: Math.floor(Math.random() * 30) + 40 // Random value between 40-70
      }));
      setIsCalibrating(false);
    }, 3000);
  };

  const resetToDefaults = () => {
    const defaultSettings: VoiceSettings = {
      inputDevice: 'default',
      outputDevice: 'default',
      sampleRate: 44100,
      bitRate: 128,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      voiceActivation: false,
      sensitivity: 50,
      outputVolume: 80,
      language: 'en-US',
      accent: 'american',
      feedbackLevel: 'detailed'
    };
    
    setSettings(defaultSettings);
    onSettingsChange?.(defaultSettings);
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voice-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        onSettingsChange?.(importedSettings);
      } catch (error) {
        console.error('Error importing settings:', error);
      }
    };
    reader.readAsText(file);
  };

  const updateSetting = <K extends keyof VoiceSettings>(key: K, value: VoiceSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const inputDevices = devices.filter(d => d.kind === 'audioinput');
  const outputDevices = devices.filter(d => d.kind === 'audiooutput');

  return (
    <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Voice Settings
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={exportSettings}>
              <Download className="w-4 h-4" />
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
              <Button variant="ghost" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                </span>
              </Button>
            </label>
            <Button variant="ghost" size="sm" onClick={resetToDefaults}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Device Permissions */}
        {devicePermission !== 'granted' && (
          <div className={`p-4 rounded-lg border ${
            devicePermission === 'denied' 
              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
              : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
          }`}>
            <div className="flex items-center gap-3">
              {devicePermission === 'denied' ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {devicePermission === 'denied' 
                    ? 'Microphone Access Denied' 
                    : 'Microphone Permission Required'
                  }
                </p>
                <p className="text-sm opacity-75">
                  {devicePermission === 'denied'
                    ? 'Please enable microphone access in your browser settings'
                    : 'Grant microphone access to use voice features'
                  }
                </p>
              </div>
              {devicePermission === 'prompt' && (
                <Button onClick={requestPermissions} size="sm">
                  Grant Access
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Audio Devices */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Audio Devices
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input Device */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Microphone
              </label>
              <select
                value={settings.inputDevice}
                onChange={(e) => updateSetting('inputDevice', e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                disabled={devicePermission !== 'granted'}
              >
                <option value="default">Default Microphone</option>
                {inputDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Output Device */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Speaker/Headphones
              </label>
              <select
                value={settings.outputDevice}
                onChange={(e) => updateSetting('outputDevice', e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="default">Default Speaker</option>
                {outputDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Microphone Test */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Microphone Test
            </h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testMicrophone}
                disabled={isTestingMic || devicePermission !== 'granted'}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isTestingMic ? 'Testing...' : 'Test Mic'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={calibrateMicrophone}
                disabled={isCalibrating || devicePermission !== 'granted'}
              >
                <Sliders className="w-4 h-4 mr-2" />
                {isCalibrating ? 'Calibrating...' : 'Auto-Calibrate'}
              </Button>
            </div>
          </div>

          {/* Microphone Level Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Input Level</span>
              <span>{Math.round((micLevel / 128) * 100)}%</span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className={`h-full transition-all duration-100 ${
                  micLevel > 100 ? 'bg-red-500' : micLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((micLevel / 128) * 100, 100)}%` }}
              />
            </div>
            {isTestingMic && (
              <p className="text-xs text-center text-blue-600">
                Speak into your microphone to test the input level
              </p>
            )}
          </div>
        </div>

        {/* Audio Quality Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Audio Quality
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sample Rate */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Sample Rate
              </label>
              <select
                value={settings.sampleRate}
                onChange={(e) => updateSetting('sampleRate', parseInt(e.target.value))}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value={22050}>22.05 kHz (Low)</option>
                <option value={44100}>44.1 kHz (Standard)</option>
                <option value={48000}>48 kHz (High)</option>
              </select>
            </div>

            {/* Bit Rate */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bit Rate
              </label>
              <select
                value={settings.bitRate}
                onChange={(e) => updateSetting('bitRate', parseInt(e.target.value))}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value={64}>64 kbps (Low)</option>
                <option value={96}>96 kbps (Medium)</option>
                <option value={128}>128 kbps (High)</option>
                <option value={192}>192 kbps (Very High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audio Enhancement */}
        <div className="space-y-4">
          <h4 className="font-medium">Audio Enhancement</h4>
          
          <div className="space-y-3">
            {/* Echo Cancellation */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Echo Cancellation</label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Reduces echo and feedback
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.echoCancellation}
                  onChange={(e) => updateSetting('echoCancellation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Noise Suppression */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Noise Suppression</label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Reduces background noise
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.noiseSuppression}
                  onChange={(e) => updateSetting('noiseSuppression', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Auto Gain Control */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Auto Gain Control</label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automatically adjusts volume
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoGainControl}
                  onChange={(e) => updateSetting('autoGainControl', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Voice Detection */}
        <div className="space-y-4">
          <h4 className="font-medium">Voice Detection</h4>
          
          <div className="space-y-4">
            {/* Voice Activation */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Voice Activation</label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Start recording automatically when speaking
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voiceActivation}
                  onChange={(e) => updateSetting('voiceActivation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Sensitivity */}
            {settings.voiceActivation && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Sensitivity</label>
                  <span className="text-sm">{settings.sensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sensitivity}
                  onChange={(e) => updateSetting('sensitivity', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less Sensitive</span>
                  <span>More Sensitive</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Language & Pronunciation */}
        <div className="space-y-4">
          <h4 className="font-medium">Language & Pronunciation</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Language */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="en-AU">English (AU)</option>
                <option value="en-CA">English (CA)</option>
                <option value="es-ES">Spanish (ES)</option>
                <option value="es-MX">Spanish (MX)</option>
                <option value="fr-FR">French (FR)</option>
                <option value="de-DE">German (DE)</option>
                <option value="zh-CN">Chinese (CN)</option>
                <option value="ja-JP">Japanese (JP)</option>
              </select>
            </div>

            {/* Accent */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Accent Reference
              </label>
              <select
                value={settings.accent}
                onChange={(e) => updateSetting('accent', e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="american">American</option>
                <option value="british">British</option>
                <option value="australian">Australian</option>
                <option value="canadian">Canadian</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback Level */}
        <div className="space-y-4">
          <h4 className="font-medium">Feedback Settings</h4>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Feedback Detail Level
            </label>
            <div className="flex gap-2">
              {(['basic', 'detailed', 'expert'] as const).map((level) => (
                <Button
                  key={level}
                  variant={settings.feedbackLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('feedbackLevel', level)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {settings.feedbackLevel === 'basic' && 'Simple scores and overall feedback'}
              {settings.feedbackLevel === 'detailed' && 'Word-by-word analysis with suggestions'}
              {settings.feedbackLevel === 'expert' && 'Phoneme-level analysis with technical details'}
            </p>
          </div>
        </div>

        {/* Output Volume */}
        <div className="space-y-4">
          <h4 className="font-medium">Output Settings</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium">Output Volume</label>
              <span className="text-sm">{settings.outputVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.outputVolume}
              onChange={(e) => updateSetting('outputVolume', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mute</span>
              <span>Max</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={`p-3 rounded-lg ${
          devicePermission === 'granted' 
            ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700'
            : 'bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-600'
        }`}>
          <div className="flex items-center gap-2">
            {devicePermission === 'granted' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            )}
            <span className="text-sm font-medium">
              {devicePermission === 'granted' 
                ? 'Voice features are ready to use'
                : 'Microphone access required for voice features'
              }
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}