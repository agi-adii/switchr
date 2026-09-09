import { create } from "zustand";

export type ConversionStatus = "idle" | "converting" | "done" | "error";

export interface FileItem {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  fromFormat: string;
  toFormat: string;
  status: ConversionStatus;
  progress: number;
  outputUrl?: string;
  error?: string;
}

interface ConversionState {
  files: FileItem[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, data: Partial<FileItem>) => void;
  setAllTargetFormats: (format: string) => void;
  clearAll: () => void;
  removeCompleted: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useConversionStore = create<ConversionState>((set) => ({
  files: [],
  addFiles: (newFiles) => {
    set((state) => {
      const newItems = newFiles.map((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        // Default target format logic: if it's an image, default to webp. If video, to mp4.
        // We can refine this later in the UI.
        let defaultTo = "webp";
        if (["mp4", "mov", "avi", "mkv"].includes(ext)) defaultTo = "mp4";
        else if (["mp3", "wav", "aac"].includes(ext)) defaultTo = "mp3";

        return {
          id: generateId(),
          file,
          fileName: file.name,
          fileSize: file.size,
          fromFormat: ext,
          toFormat: defaultTo,
          status: "idle",
          progress: 0,
        } as FileItem;
      });
      return { files: [...state.files, ...newItems] };
    });
  },
  removeFile: (id) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },
  updateFile: (id, data) => {
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...data } : f)),
    }));
  },
  setAllTargetFormats: (format) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.status === "idle" || f.status === "error" ? { ...f, toFormat: format } : f
      ),
    }));
  },
  clearAll: () => set({ files: [] }),
  removeCompleted: () => {
    set((state) => ({
      files: state.files.filter((f) => f.status !== "done"),
    }));
  },
}));
