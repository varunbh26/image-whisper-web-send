
import { useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an image file.",
        });
        return;
      }
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please drop an image file.",
        });
        return;
      }
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image first.",
      });
      return;
    }

    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch(`https://your-api-endpoint.com/upload?image=${encodeURIComponent(previewUrl || '')}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">Image Upload</h1>
        
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 mx-auto object-contain rounded-lg"
              />
              <p className="text-sm text-gray-500">Click or drag to change image</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Image className="w-12 h-12 mx-auto text-gray-400" />
              <div className="space-y-2">
                <p className="text-gray-600">Drag and drop your image here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={!selectedImage}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </Card>
    </div>
  );
};

export default ImageUploader;
