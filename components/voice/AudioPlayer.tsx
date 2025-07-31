'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square,
  SkipBack, 
  SkipForward,
  Volume2, 
  VolumeX,
  Download,
  RotateCcw,
  FastForward,
  Rewind,
  Headphones
} from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  audioBlob?: Blob;
  title?: string;
  autoPlay?: boolean;
  showDownload?: boolean;
  showWaveform?: boolean;
  onPlaybackComplete?: () => void;
  onPlaybackStart?: () => void;
  onPlaybackPause?: () => void;
  isDarkMode?: boolean;
  themeClasses?: any;
  disabled?: boolean;
}

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  playbackRate: number;
}

export function AudioPlayer({
  audioUrl,
  audioBlob,
  title = "Audio Recording",
  autoPlay = false,
  showDownload = true,
  showWaveform = false,
  onPlaybackComplete,
  onPlaybackStart,
  onPlaybackPause,
  isDarkMode = false,
  themeClasses,
  disabled = false
}: AudioPlayerProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isLoading: false,
    playbackRate: 1
  });

  const [waveformData, setWaveformData] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Get effective audio URL
  const effectiveAudioUrl = audioUrl || (audioBlob ? URL.createObjectURL(audioBlob) : null);

  // Initialize audio
  useEffect(() => {
    if (effectiveAudioUrl && !audioRef.current) {
      audioRef.current = new Audio(effectiveAudioUrl);
      
      audioRef.current.addEventListener('loadstart', () => {
        setPlaybackState(prev => ({ ...prev, isLoading: true }));
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        setPlaybackState(prev => ({ 
          ...prev, 
          duration: audioRef.current?.duration || 0,
          isLoading: false 
        }));
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setPlaybackState(prev => ({ 
          ...prev, 
          currentTime: audioRef.current?.currentTime || 0 
        }));
      });

      audioRef.current.addEventListener('ended', () => {
        setPlaybackState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
        onPlaybackComplete?.();
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setPlaybackState(prev => ({ ...prev, isLoading: false, isPlaying: false }));
      });

      // Generate waveform data if needed
      if (showWaveform) {
        generateWaveform();
      }

      if (autoPlay) {
        play();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioBlob && effectiveAudioUrl) {
        URL.revokeObjectURL(effectiveAudioUrl);
      }
    };
  }, [effectiveAudioUrl]);

  // Generate waveform data (simplified visualization)
  const generateWaveform = async () => {
    if (!effectiveAudioUrl) return;
    
    try {
      const response = await fetch(effectiveAudioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const samples = 100; // Number of waveform bars
      const blockSize = Math.floor(audioBuffer.length / samples);
      const channelData = audioBuffer.getChannelData(0);
      const waveform: number[] = [];
      
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(channelData[i * blockSize + j] || 0);
        }
        waveform.push(sum / blockSize);
      }
      
      setWaveformData(waveform);
    } catch (error) {
      console.error('Error generating waveform:', error);
    }
  };

  // Play audio
  const play = async () => {
    if (!audioRef.current || disabled) return;
    
    try {
      await audioRef.current.play();
      setPlaybackState(prev => ({ ...prev, isPlaying: true }));
      onPlaybackStart?.();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Pause audio
  const pause = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    onPlaybackPause?.();
  };

  // Stop audio
  const stop = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaybackState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  };

  // Seek to position
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = Math.max(0, Math.min(time, playbackState.duration));
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    seekTo(playbackState.currentTime + seconds);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuted = !playbackState.isMuted;
    audioRef.current.muted = newMuted;
    setPlaybackState(prev => ({ ...prev, isMuted: newMuted }));
  };

  // Change volume
  const changeVolume = (volume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setPlaybackState(prev => ({ ...prev, volume: clampedVolume }));
  };

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.playbackRate = rate;
    setPlaybackState(prev => ({ ...prev, playbackRate: rate }));
  };

  // Download audio
  const downloadAudio = () => {
    if (!effectiveAudioUrl) return;
    
    const a = document.createElement('a');
    a.href = effectiveAudioUrl;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = playbackState.duration > 0 
    ? (playbackState.currentTime / playbackState.duration) * 100 
    : 0;

  if (!effectiveAudioUrl) {
    return (
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="text-center py-8">
          <Headphones className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No audio file provided
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              {title}
            </h3>
            {playbackState.duration > 0 && (
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Duration: {formatTime(playbackState.duration)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {playbackState.playbackRate}x
            </Badge>
            {showDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadAudio}
                disabled={disabled}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Waveform Visualization */}
        {showWaveform && waveformData.length > 0 && (
          <div className="relative h-20">
            <div className="flex items-end h-full gap-1">
              {waveformData.map((amplitude, index) => {
                const isActive = (index / waveformData.length) <= (progressPercentage / 100);
                return (
                  <div
                    key={index}
                    className={`flex-1 rounded-t transition-colors duration-150 ${
                      isActive 
                        ? 'bg-blue-500' 
                        : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                    style={{ 
                      height: `${Math.max(2, amplitude * 100)}%`,
                      cursor: 'pointer'
                    }}
                    onClick={() => seekTo((index / waveformData.length) * playbackState.duration)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono">{formatTime(playbackState.currentTime)}</span>
            <span className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime(playbackState.duration)}
            </span>
          </div>
          <div 
            className="cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              seekTo(percentage * playbackState.duration);
            }}
          >
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(-10)}
            disabled={disabled || playbackState.isLoading}
          >
            <Rewind className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(-5)}
            disabled={disabled || playbackState.isLoading}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            onClick={playbackState.isPlaying ? pause : play}
            disabled={disabled || playbackState.isLoading}
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {playbackState.isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            ) : playbackState.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(5)}
            disabled={disabled || playbackState.isLoading}
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(10)}
            disabled={disabled || playbackState.isLoading}
          >
            <FastForward className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={stop}
            disabled={disabled || playbackState.isLoading}
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              disabled={disabled}
            >
              {playbackState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={playbackState.volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                disabled={disabled || playbackState.isMuted}
                className="w-20"
              />
              <span className="text-xs w-8">{Math.round(playbackState.volume * 100)}</span>
            </div>
          </div>

          {/* Playback Speed Control */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Speed:</span>
            <select
              value={playbackState.playbackRate}
              onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
              disabled={disabled}
              className={`text-sm p-1 rounded border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => seekTo(0)}
            disabled={disabled}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Loading State */}
        {playbackState.isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading audio...
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}