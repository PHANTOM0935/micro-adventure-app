
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation, X, Map, Route, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ARViewProps {
  onClose: () => void;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const ARView: React.FC<ARViewProps> = ({ onClose, currentLocation }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARInitialized, setIsARInitialized] = useState(false);
  const [foundTreasure, setFoundTreasure] = useState(false);
  const { toast } = useToast();

  // Initialize camera for AR view
  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsARInitialized(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
        });
      }
    };

    initCamera();

    // Clean up function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [toast]);

  // Simulate finding a treasure after a short delay
  useEffect(() => {
    if (isARInitialized && currentLocation) {
      const treasureTimer = setTimeout(() => {
        setFoundTreasure(true);
        toast({
          title: "Treasure Found!",
          description: "You discovered a hidden gem!",
          variant: "default",
        });
      }, 5000);

      return () => clearTimeout(treasureTimer);
    }
  }, [isARInitialized, currentLocation, toast]);

  // Render AR objects (in a real app, this would use an AR library)
  useEffect(() => {
    if (!isARInitialized || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw simple AR objects (in a real app, we'd use AR.js or similar)
      if (foundTreasure) {
        // Draw treasure chest
        ctx.fillStyle = "#9b87f5";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
        ctx.fill();
        
        // Glowing effect
        ctx.strokeStyle = "#1EAEDB";
        ctx.lineWidth = 5;
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("TREASURE!", canvas.width / 2, canvas.height / 2 + 5);
      } else {
        // Draw direction indicator
        ctx.fillStyle = "rgba(155, 135, 245, 0.6)";
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height - 100);
        ctx.lineTo(canvas.width / 2 - 30, canvas.height - 150);
        ctx.lineTo(canvas.width / 2 + 30, canvas.height - 150);
        ctx.closePath();
        ctx.fill();
      }

      // Continue animation
      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }, [isARInitialized, foundTreasure]);

  // Handle treasure collection
  const collectTreasure = () => {
    if (foundTreasure) {
      toast({
        title: "Collected!",
        description: "Treasure has been added to your inventory!",
        variant: "default",
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Camera feed */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
      
      {/* AR overlay */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      
      {/* UI Controls */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="secondary" 
          size="icon"
          className="rounded-full bg-black/30 backdrop-blur-sm border border-white/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Bottom UI */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        {foundTreasure ? (
          <Button 
            className="w-full bg-treasure-DEFAULT hover:bg-treasure-secondary text-white font-bold py-4"
            onClick={collectTreasure}
          >
            <Image className="mr-2 h-5 w-5" />
            Collect Treasure
          </Button>
        ) : (
          <div className="bg-black/50 text-white p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Route className="mr-2 h-5 w-5 text-treasure-accent" />
              <p>Scanning for treasures...</p>
            </div>
            <p className="text-sm text-gray-300">Move your phone around to find hidden treasures</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARView;
