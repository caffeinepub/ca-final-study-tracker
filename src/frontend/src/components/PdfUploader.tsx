import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Loader2, FileText } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

export function PdfUploader() {
  const { actor } = useActor();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chapterName, setChapterName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
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
    if (!actor || !selectedFile || !chapterName.trim()) {
      toast.error('Please select a file and enter a chapter name');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await actor.uploadPdf(uint8Array, chapterName);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success('PDF uploaded successfully');
      setSelectedFile(null);
      setChapterName('');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Study Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chapterName">Chapter Name</Label>
          <Input
            id="chapterName"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="Enter chapter name"
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pdfFile">PDF File (Max 10MB)</Label>
          <Input
            id="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
              <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">{uploadProgress}% uploaded</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !chapterName.trim() || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
