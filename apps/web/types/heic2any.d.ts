declare module "heic2any" {
  export interface Heic2AnyOptions {
    blob: Blob;
    toType?: "image/jpeg" | "image/png" | "image/gif" | string;
    quality?: number;
    multiple?: boolean;
  }
  export default function heic2any(options: Heic2AnyOptions): Promise<Blob | Blob[]>;
}
