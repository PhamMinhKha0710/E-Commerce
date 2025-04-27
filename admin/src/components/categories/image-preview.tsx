import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  image: string;
}

export default function ImagePreview({ image }: ImagePreviewProps) {
  return (
    <div className="border rounded-md w-full h-[200px] flex items-center justify-center overflow-hidden relative">
      {image ? (
        <Image
          src={image || "/placeholder.svg"}
          alt="Category preview"
          fill
          style={{ objectFit: "cover" }}
          priority={false}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="h-10 w-10 mb-2" />
          <span>Chưa có hình ảnh</span>
        </div>
      )}
    </div>
  );
}