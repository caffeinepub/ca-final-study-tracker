import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUploadQuestionPaper } from '../hooks/useUploadQuestionPaper';
import { toast } from 'sonner';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function QuestionPaperUploader() {
  const [paperName, setPaperName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadQuestionPaper();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValidationError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      setValidationError('Only PDF files are allowed.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(`File size must be under ${MAX_FILE_SIZE_MB}MB.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!paperName.trim()) {
      setValidationError('Please enter a name for the question paper.');
      return;
    }
    if (!selectedFile) {
      setValidationError('Please select a PDF file to upload.');
      return;
    }

    setValidationError(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfBlob = new Uint8Array(arrayBuffer);

      await uploadMutation.mutateAsync({ name: paperName.trim(), pdfBlob });

      toast.success(`"${paperName.trim()}" uploaded successfully! 📄`);
      setPaperName('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      toast.error('Upload failed. Please try again.');
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Upload Question Paper</CardTitle>
        </div>
        <CardDescription>Upload a PDF question paper to reference when reattempting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationError && (
          <Alert variant="destructive">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="paper-name">Paper Name / Label</Label>
          <Input
            id="paper-name"
            placeholder="e.g. CA Final SFM Nov 2023"
            value={paperName}
            onChange={(e) => setPaperName(e.target.value)}
            disabled={uploadMutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pdf-file">PDF File (max {MAX_FILE_SIZE_MB}MB)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="pdf-file"
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploadMutation.isPending}
              className="cursor-pointer"
            />
            {selectedFile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                disabled={uploadMutation.isPending}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {selectedFile && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploadMutation.isPending || !selectedFile || !paperName.trim()}
          className="w-full gap-2"
        >
          {uploadMutation.isPending ? (
            <>
              <Upload className="h-4 w-4 animate-bounce" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Paper
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
