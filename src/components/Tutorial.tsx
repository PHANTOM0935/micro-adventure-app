
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Camera, Eye, Navigation, Image } from "lucide-react";

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "Welcome to GeoTreasure Hunt!",
      description: "Discover hidden treasures in the real world using your phone's GPS and camera.",
      icon: <Map className="h-12 w-12 text-treasure-DEFAULT" />,
      content: "This game uses your location to place virtual treasures around you. Explore your surroundings to find them!"
    },
    {
      title: "Find Treasures on the Map",
      description: "Your location is shown on the map with nearby treasures.",
      icon: <Navigation className="h-12 w-12 text-treasure-DEFAULT" />,
      content: "Walk around in the real world to get close to treasures. When you're near one, you'll get a notification."
    },
    {
      title: "Use AR to Discover Treasures",
      description: "When you're close to a treasure, use the AR view to find it.",
      icon: <Camera className="h-12 w-12 text-treasure-DEFAULT" />,
      content: "Point your camera around to reveal hidden treasures and overcome obstacles."
    },
    {
      title: "Collect and Complete",
      description: "Tap on treasures in AR view to collect them.",
      icon: <Image className="h-12 w-12 text-treasure-DEFAULT" />,
      content: "Each treasure you collect adds to your inventory. Some may be part of special collections!"
    },
    {
      title: "Ready to Hunt?",
      description: "Let's start your treasure hunting adventure!",
      icon: <Eye className="h-12 w-12 text-treasure-DEFAULT" />,
      content: "Keep your phone charged and be aware of your surroundings while playing. Happy hunting!"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-treasure-dark/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {step.icon}
          </div>
          <CardTitle className="text-2xl font-bold text-treasure-DEFAULT">
            {step.title}
          </CardTitle>
          <CardDescription className="text-white/80">
            {step.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>{step.content}</p>
          
          {/* Progress indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${currentStep === index ? 'bg-treasure-DEFAULT' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" className="text-white/70" onClick={handleSkip}>
            Skip
          </Button>
          <Button 
            className="bg-treasure-DEFAULT hover:bg-treasure-secondary" 
            onClick={handleNext}
          >
            {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Start Hunting'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Tutorial;
