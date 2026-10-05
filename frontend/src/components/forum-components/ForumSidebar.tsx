import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Plus } from 'lucide-react';

interface ForumSidebarProps {
  onTagSelect: (tag: string | null) => void;
  selectedTag: string | null;
}

const ForumSidebar: React.FC<ForumSidebarProps> = ({ onTagSelect, selectedTag }) => {
  const { getToken } = useAuth();
  const [popularTags, setPopularTags] = useState<{tag: string, count: number}[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    const fetchPopularTags = async () => {
      setIsLoadingTags(true);
      try {
        const token = await getToken();
        // This would typically be a separate endpoint in your API
        // For now we'll simulate it with a mock response
        // In a real implementation, create an endpoint that returns tag counts
        
        // Mock data - replace with actual API call when available
        const mockTags = [
          { tag: 'Nutrition', count: 42 },
          { tag: 'Weight Loss', count: 37 },
          { tag: 'Strength Training', count: 29 },
          { tag: 'Cardio', count: 24 },
          { tag: 'Meal Prep', count: 19 },
          { tag: 'Motivation', count: 16 },
          { tag: 'Progress', count: 14 },
          { tag: 'Recovery', count: 12 },
          { tag: 'Yoga', count: 10 },
          { tag: 'Supplements', count: 8 }
        ];
        
        setPopularTags(mockTags);
      } catch (error) {
        console.error('Error fetching popular tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchPopularTags();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-nexafit-navbar flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-nexafit-accent hover:bg-nexafit-accent/90" 
            onClick={() => document.getElementById('start-discussion-button')?.click()}
          >
            Start a Discussion
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-nexafit-navbar flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTags ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                className={`w-full justify-start ${selectedTag === null ? "bg-nexafit-accent hover:bg-nexafit-accent/90" : ""}`}
                onClick={() => onTagSelect(null)}
              >
                All Topics
              </Button>
              
              {popularTags.map((tagData) => (
                <Button
                  key={tagData.tag}
                  variant={selectedTag === tagData.tag ? "default" : "outline"}
                  className={`w-full justify-between ${selectedTag === tagData.tag ? "bg-nexafit-accent hover:bg-nexafit-accent/90" : ""}`}
                  onClick={() => onTagSelect(tagData.tag)}
                >
                  <span>{tagData.tag}</span>
                  <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                    {tagData.count}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-nexafit-navbar">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Be respectful to other community members</li>
            <li>Share evidence-based information when possible</li>
            <li>Avoid giving medical advice if not qualified</li>
            <li>Stay on topic and use appropriate tags</li>
            <li>Report harmful or inappropriate content</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumSidebar;