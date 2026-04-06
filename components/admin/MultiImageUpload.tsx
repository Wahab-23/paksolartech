"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MultiImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function MultiImageUpload({ images, onChange }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages = [...images];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();

                if (res.ok) {
                    newImages.push(data.url);
                } else {
                    toast.error(`Failed to upload ${files[i].name}: ${data.error}`);
                }
            } catch (error) {
                toast.error(`Error uploading ${files[i].name}`);
            }
        }

        onChange(newImages);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative aspect-square group rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
                        <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/10 hover:bg-muted/20 hover:border-primary/30 transition-all group"
                >
                    {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                    <span className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-primary">
                        {uploading ? "Uploading..." : "Add Images"}
                    </span>
                </button>
            </div>
            
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
            />
            
            <p className="text-[10px] text-muted-foreground italic">
                Tip: The first image will be used as the primary product image.
            </p>
        </div>
    );
}
