
import { useState } from 'react';
import { Upload, Activity, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string>("");
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

      const data = await response.json();
      setPrediction(data.prediction || "No prediction available");

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
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg border-2 border-sky-100">
        <div className="flex items-center justify-center space-x-3">
          <Activity className="w-10 h-10 text-sky-600" />
          <h1 className="text-3xl font-bold text-sky-800">Lungs-Di</h1>
        </div>
        
        <div
          className="border-2 border-dashed border-sky-300 rounded-lg p-8 text-center cursor-pointer hover:border-sky-500 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 mx-auto object-contain rounded-lg shadow-md"
              />
              <p className="text-sm text-sky-600">Click or drag to change image</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Activity className="w-12 h-12 mx-auto text-sky-400" />
              <div className="space-y-2">
                <p className="text-sky-700">Drag and drop your medical image here</p>
                <p className="text-sm text-sky-500">or click to browse</p>
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
          className="w-full bg-sky-600 hover:bg-sky-700"
          onClick={handleUpload}
          disabled={!selectedImage}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>

        {prediction && (
          <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
            <div className="flex items-center gap-2 text-sky-800">
              <MessageSquare className="w-5 h-5" />
              <p className="text-sm font-medium">{prediction}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImageUploader;

