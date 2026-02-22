import { useRef, useState } from "react";
import { User, Camera, X } from "lucide-react";

export function ProfileImageUpload({
  currentImage,
  onImageChange,
}: {
  currentImage: string | null;
  onImageChange: (base64: string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [dragOver, setDragOver] = useState(false);

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div
          className={`h-28 w-28 rounded-full border-2 overflow-hidden transition-all ${
            dragOver ? "border-primary border-dashed" : "border-border"
          } bg-muted flex items-center justify-center`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {preview ? (
            <img src={preview} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <User className="h-12 w-12 text-muted-foreground/40" />
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
          aria-label="Upload photo"
        >
          <Camera className="h-4 w-4" />
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
            aria-label="Remove photo"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="text-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-medium text-primary hover:underline"
        >
          Click to upload
        </button>
        <span className="text-sm text-muted-foreground"> or drag & drop</span>
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP — max 2MB</p>
      </div>
    </div>
  );
}