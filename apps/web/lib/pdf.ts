import jsPDF from "jspdf";

export const convertImageToPdf = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = function (event) {
        if (onProgress) onProgress(0.3); // Notify read complete
        
        const img = new Image();
        img.onload = function () {
          if (onProgress) onProgress(0.6); // Notify image parsed

          // Create a PDF with custom dimensions to exactly match the image
          const orientation = img.width > img.height ? "l" : "p";
          const pdf = new jsPDF({
            orientation: orientation,
            unit: "px",
            format: [img.width, img.height]
          });

          // Extract format string
          const ext = file.name.split('.').pop()?.toUpperCase() || 'JPEG';
          let format = 'JPEG';
          if (ext === 'PNG') format = 'PNG';
          else if (ext === 'WEBP') format = 'WEBP';
          else if (ext === 'GIF') format = 'GIF';
          else if (ext === 'BMP') format = 'BMP';
          
          pdf.addImage(img, format, 0, 0, img.width, img.height);
          
          if (onProgress) onProgress(0.9); // Notify PDF generated
          
          const blob = pdf.output("blob");
          
          if (onProgress) onProgress(1); // Done
          resolve(URL.createObjectURL(blob));
        };
        
        img.onerror = function () {
          reject(new Error("Failed to load image for PDF conversion."));
        };

        if (typeof event.target?.result === "string") {
          img.src = event.target.result;
        } else {
          reject(new Error("Invalid image data read."));
        }
      };

      reader.onerror = function () {
        reject(new Error("Failed to read file."));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};
