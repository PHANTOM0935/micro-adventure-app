
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, Map } from "lucide-react";

interface ProfileSectionProps {
  onClose: () => void;
  treasuresFound: number;
  onReset: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onClose, treasuresFound, onReset }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 p-4 overflow-auto">
      <div className="max-w-md mx-auto mt-12">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Explorer Profile</h2>
          <Button variant="ghost" className="text-white" onClick={onClose}>
            Close
          </Button>
        </div>
        
        {/* User Stats Card */}
        <Card className="bg-treasure-dark/50 border border-treasure-DEFAULT/20 text-white mb-4">
          <CardHeader>
            <CardTitle className="text-treasure-DEFAULT">Explorer Stats</CardTitle>
            <CardDescription className="text-white/70">Your adventure progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-treasure-DEFAULT">{treasuresFound}</p>
                <p className="text-sm text-white/70">Treasures Found</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-treasure-accent">3</p>
                <p className="text-sm text-white/70">Areas Explored</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-treasure-secondary">250</p>
                <p className="text-sm text-white/70">Points</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-white">Explorer</p>
                <p className="text-sm text-white/70">Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="bg-treasure-dark/50 border border-treasure-DEFAULT/20 text-white mb-4">
          <CardHeader>
            <CardTitle className="text-treasure-DEFAULT">Recent Discoveries</CardTitle>
          </CardHeader>
          <CardContent>
            {treasuresFound > 0 ? (
              <ul className="space-y-2">
                {[...Array(Math.min(treasuresFound, 5))].map((_, i) => (
                  <li key={i} className="bg-black/30 p-3 rounded-lg flex items-center">
                    <div className="w-8 h-8 rounded-full bg-treasure-DEFAULT flex items-center justify-center mr-3">
                      🗝️
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hidden Treasure #{i+1}</p>
                      <p className="text-xs text-white/70">Found just now</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70">No treasures discovered yet</p>
                <p className="text-sm text-white/50 mt-2">Get outside and start exploring!</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button 
            variant="outline" 
            className="border-treasure-DEFAULT text-treasure-DEFAULT hover:bg-treasure-DEFAULT hover:text-white"
          >
            <Navigation className="mr-2 h-4 w-4" />
            View Achievements
          </Button>
          <Button 
            variant="outline" 
            className="border-treasure-accent text-treasure-accent hover:bg-treasure-accent hover:text-white"
          >
            <Map className="mr-2 h-4 w-4" />
            Explore History
          </Button>
        </div>
        
        {/* Reset Button */}
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            className="text-white/50 hover:text-white hover:bg-destructive"
            onClick={onReset}
          >
            Reset Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
