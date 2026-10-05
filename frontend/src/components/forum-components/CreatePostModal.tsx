import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { X } from 'lucide-react';
import SubmitButton from '../ui-components/parts/SubmitButton';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const POPULAR_TAGS = [
  'Nutrition', 'Weight Loss', 'Strength Training', 'Cardio', 
  'Yoga', 'Recovery', 'Meal Prep', 'Motivation', 'Progress'
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a post",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure the URL has the proper protocol
      const apiUrl = new URL("/forum/posts", import.meta.env.VITE_API_URL).toString();
      
      console.log("Submitting post to:", apiUrl);
      
      await axios.post(
        apiUrl,
        {
          title,
          content,
          tags,
          user_id: user.id,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Reset form
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      setErrors({});
      
      toast({
        title: "Success",
        description: "Your post has been created",
      });
      
      onPostCreated();
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      if (axios.isAxiosError(err) && err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        
        toast({
          title: "Error",
          description: err.response.data.detail || 'Failed to create post',
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  const handleSuggestedTagClick = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-nexafit-navbar">Create New Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (up to 5)</Label>
            <div className="flex">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags (press Enter)"
                className="flex-1 rounded-r-none"
              />
              <Button 
                type="button" 
                onClick={addTag} 
                className="bg-nexafit-accent hover:bg-nexafit-accent/90 rounded-l-none"
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-nexafit-accent/10 text-nexafit-accent px-2 py-1 rounded text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-nexafit-accent/70 hover:text-nexafit-accent"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {tags.length < 5 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Suggested tags:</p>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_TAGS.filter(tag => !tags.includes(tag)).slice(0, 8).map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestedTagClick(tag)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <SubmitButton
              isLoading={isSubmitting}
              isDisabled={!title.trim() || !content.trim()}
              text="Create Post"
              loadingText="Creating..."
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
