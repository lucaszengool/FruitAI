'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  HelpCircle,
  Zap,
  Camera,
  Image as ImageIcon,
  ScanLine,
  CheckCircle
} from 'lucide-react';

interface CameraViewProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

export function CameraView({ isOpen, onClose, onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState(true); // Always show camera interface
  const [selectedMode, setSelectedMode] = useState('scan');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(true); // Skip video loading states

  const scanModes = [
    { id: 'scan', label: 'Scan Freshness', icon: ScanLine }
  ];

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setHasPermission(false);
    setIsVideoReady(false);
  }, [stream]);

  const startCamera = async () => {
    // Simplified - just start the video stream without complex error handling
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStream(mediaStream);
      }
    } catch (error) {
      console.log('Camera not available, using file input fallback');
      // Don't show error - just rely on file input
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(); // Always try to start camera when opened
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Brief delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 200));

      onCapture(imageData);
      onClose();
    } catch (error) {
      console.error('Error capturing image:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [onCapture, onClose]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onCapture(imageData);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50"
      >
        {/* Camera View */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Background video (if camera works) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Always show camera interface overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {/* Scanning Frame Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Scanning Frame */}
              <motion.div
                className="w-80 h-80 border-4 border-white rounded-3xl relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg translate-x-1 translate-y-1" />

                {/* Scanning line animation */}
                <motion.div
                  className="absolute inset-x-4 h-1 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                  animate={{
                    y: [0, 300, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Center dot */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.div>

              {/* Help text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
              >
                <p className="text-white text-sm opacity-90">
                  Position fruits within the frame
                </p>
                <p className="text-white text-xs opacity-75 mt-1">
                  Ensure good lighting for best results
                </p>
              </motion.div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-black bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${isVideoReady ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <p className="text-white text-xs opacity-90">
                {isVideoReady ? 'Ready' : 'Loading...'}
              </p>
            </div>

            <button className="w-10 h-10 bg-black bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-20 left-4 bg-black bg-opacity-70 text-white text-xs p-2 rounded z-10">
              <p>Permission: {hasPermission ? '✅' : '❌'}</p>
              <p>Video Ready: {isVideoReady ? '✅' : '❌'}</p>
              <p>Stream: {stream ? '✅' : '❌'}</p>
            </div>
          )}

          {/* Scan Mode Selector */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex gap-4">
              {scanModes.map((mode) => (
                <motion.button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl backdrop-blur-sm transition-all ${
                    selectedMode === mode.id
                      ? 'bg-white text-black'
                      : 'bg-black bg-opacity-30 text-white'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <mode.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{mode.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-6">
              {/* Flash toggle */}
              <button
                onClick={() => setFlashEnabled(!flashEnabled)}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                  flashEnabled ? 'bg-yellow-400 text-black' : 'bg-black bg-opacity-30 text-white'
                }`}
              >
                <Zap className="w-5 h-5" />
              </button>

              {/* Capture button with file input fallback */}
              <div className="relative">
                {stream ? (
                  // Use video capture if stream is available
                  <motion.button
                    onClick={captureImage}
                    disabled={isCapturing}
                    className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {isCapturing ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full" />
                    )}
                  </motion.button>
                ) : (
                  // Use file input if no stream
                  <label className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full" />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Gallery/Upload */}
              <label className="w-12 h-12 rounded-full bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center cursor-pointer">
                <ImageIcon className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Capture flash effect */}
          <AnimatePresence>
            {isCapturing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </AnimatePresence>
  );
}