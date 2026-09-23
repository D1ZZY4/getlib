"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function useProfileAvatar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [useDefaultIcon, setUseDefaultIcon] = useState(true);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        setUseDefaultIcon(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setProfileImage(null);
    setUseDefaultIcon(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    fileInputRef,
    profileImage,
    useDefaultIcon,
    handleFileUpload,
    handleFileChange,
    handleReset,
  };
}

export type ProfileAvatarState = ReturnType<typeof useProfileAvatar>;

export function ProfileAvatar({ avatar }: { avatar: ProfileAvatarState }) {
  const {
    fileInputRef,
    profileImage,
    useDefaultIcon,
    handleFileUpload,
    handleFileChange,
    handleReset,
  } = avatar;

  return (
    <div className="flex items-center gap-6 ">
      {useDefaultIcon ? (
        <div className="flex h-20 w-20 items-center justify-center rounded-lg">
          <Logo size={56} />
        </div>
      ) : (
        <Avatar className="h-20 w-20 rounded-lg">
          <AvatarImage src={profileImage || undefined} />
          <AvatarFallback>SS</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleFileUpload}
            className="cursor-pointer"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload new photo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="cursor-pointer"
          >
            Reset
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Allowed JPG, GIF or PNG. Max size of 800K
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/gif,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
