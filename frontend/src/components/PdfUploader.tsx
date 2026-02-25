import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import type { ExtendedActor } from '../lib/actorTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

interface PdfUploaderProps {
  chapterName: string;
  onSuccess: () => void;
}

export function PdfUploader({ chapterName, onSuccess }: PdfUploaderProps) {
  const { actor } = useActor();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!actor || !selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Simulate progress
      setUploadProgress(50);

      await (actor as unknown as ExtendedActor).uploadPdf(uint8Array, chapterName);

      setUploadProgress(100);
      toast.success('PDF uploaded successfully');
      onSuccess();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border-2 border-dashed border-primary/30 p-4">
      <div className="space-y-2">
        <Label htmlFor={`pdf-${chapterName}`}>Select PDF Notes</Label>
        <Input
          id={`pdf-${chapterName}`}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="text-sm"
        />
        {selectedFile && (
          <p className="text-xs text-muted-foreground">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {isUploading && (
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        size="sm"
        className="w-full gap-2"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? 'Uploading...' : 'Upload PDF'}
      </Button>
    </div>
  );
}
