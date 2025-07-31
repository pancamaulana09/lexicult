'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause,
  RotateCcw,
  Download,
  Trash2,
  Volume2
} from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  maxDuration?: number; // in seconds
  isDarkMode?: boolean;
  themeClasses?: any;
  disabled?: boolean;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  isPlaying: boolean;
}

export function VoiceRecorder({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  maxDuration = 300, // 5 minutes default
  isDarkMode = false,
  themeClasses,
  disabled = false
}: VoiceRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    isPlaying: false
  });

  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingQuality, setRecordingQuality] = useState<'low' | 'medium' | 'high'>('medium');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize audio context and analyzer
  const initializeAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: recordingQuality === 'high' ? 48000 : recordingQuality === 'medium' ? 44100 : 22050
        } 
      });
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  };

  // Monitor audio levels
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average);
    
    if (recordingState.isRecording) {
      animationRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  };

  // Start recording
  const startRecording = async () => {
    if (disabled) return;
    
    try {
      const stream = await initializeAudioContext();
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4') 
        ? 'audio/mp4' 
        : 'audio/webm';
        
      mediaRecorderRef.current = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: recordingQuality === 'high' ? 128000 : recordingQuality === 'medium' ? 96000 : 64000
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordingState(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false
        }));
        
        onRecordingComplete?.(audioBlob, recordingState.duration);
        onRecordingStop?.();
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(1000); // Collect data every second
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        duration: 0
      }));
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingState(prev => {
          const newDuration = prev.duration + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return prev;
          }
          return { ...prev, duration: newDuration };
        });
      }, 1000);
      
      // Start audio level monitoring
      monitorAudioLevel();
      onRecordingStart?.();
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: false
      }));
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (recordingState.audioUrl) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      
      audioPlayerRef.current = new Audio(recordingState.audioUrl);
      audioPlayerRef.current.play();
      
      setRecordingState(prev => ({ ...prev, isPlaying: true }));
      
      audioPlayerRef.current.onended = () => {
        setRecordingState(prev => ({ ...prev, isPlaying: false }));
      };
    }
  };

  // Pause playback
  const pausePlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setRecordingState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // Reset recording
  const resetRecording = () => {
    if (recordingState.isRecording) {
      stopRecording();
    }
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    
    if (recordingState.audioUrl) {
      URL.revokeObjectURL(recordingState.audioUrl);
    }
    
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
      isPlaying: false
    });
    
    setAudioLevel(0);
  };

  // Download recording
  const downloadRecording = () => {
    if (recordingState.audioBlob && recordingState.audioUrl) {
      const a = document.createElement('a');
      a.href = recordingState.audioUrl;
      a.download = `recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (recordingState.audioUrl) {
        URL.revokeObjectURL(recordingState.audioUrl);
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  const progressPercentage = (recordingState.duration / maxDuration) * 100;

  return (
    <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Recorder
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {recordingQuality.toUpperCase()}
            </Badge>
            <select
              value={recordingQuality}
              onChange={(e) => setRecordingQuality(e.target.value as 'low' | 'medium' | 'high')}
              className={`text-xs p-1 rounded border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              disabled={recordingState.isRecording}
            >
              <option value="low">Low (64kbps)</option>
              <option value="medium">Medium (96kbps)</option>
              <option value="high">High (128kbps)</option>
            </select>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="text-center space-y-4">
          {/* Main Record Button */}
          <div className="relative">
            <Button
              size="lg"
              onClick={recordingState.isRecording ? stopRecording : startRecording}
              disabled={disabled}
              className={`w-20 h-20 rounded-full text-white transition-all duration-300 ${
                recordingState.isRecording 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/30' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              {recordingState.isRecording ? (
                <Square className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
            
            {/* Audio Level Indicator */}
            {recordingState.isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-30"></div>
            )}
          </div>

          {/* Duration and Progress */}
          <div className="space-y-2">
            <div className="text-xl font-mono">
              {formatDuration(recordingState.duration)} / {formatDuration(maxDuration)}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Audio Level Meter */}
          {recordingState.isRecording && (
            <div className="space-y-2">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Audio Level
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                  style={{ width: `${Math.min((audioLevel / 128) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Status */}
          {recordingState.isRecording && (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              Recording in progress...
            </div>
          )}
        </div>

        {/* Playback Controls */}
        {recordingState.audioUrl && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={recordingState.isPlaying ? pausePlayback : playRecording}
              >
                {recordingState.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadRecording}
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetRecording}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Recording Tips */}
        <div className={`text-xs p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="font-medium mb-1">Recording Tips:</div>
          <ul className={`space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li>• Speak clearly and at a normal pace</li>
            <li>• Keep device 6-8 inches from your mouth</li>
            <li>• Find a quiet environment for best results</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}