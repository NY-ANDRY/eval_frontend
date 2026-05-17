import { useState } from "react";
import JSZip from "jszip";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { DataImageImport } from "../../../services/DataImageImport.js";

const ImageImport = () => {
    const { notify, setGlobalLoading } = useNotification();
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const extractedImages = await handleZip(file);
        setImages(extractedImages);
    }

    const handleZip = async (file) => {

        const zip = await JSZip.loadAsync(file);

        const extractedImages = [];

        const files = Object.keys(zip.files);

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i];
            const zipEntry = zip.files[fileName];

            if (zipEntry.dir) continue;

            const lowerName = fileName.toLowerCase();

            const isImage =
                lowerName.endsWith(".png") ||
                lowerName.endsWith(".jpg") ||
                lowerName.endsWith(".jpeg") ||
                lowerName.endsWith(".gif") ||
                lowerName.endsWith(".webp") ||
                lowerName.endsWith(".svg") ||
                lowerName.endsWith(".bmp");

            if (!isImage) continue;

            const blob = await zipEntry.async("blob");

            extractedImages.push({
                name: fileName,
                url: URL.createObjectURL(blob),
                blob,
            });
        }

        return extractedImages;
    };

    const handleImport = async () => {
        if (images.length <= 0) {
            return;
        }
        try {
            setLoading(true);
            setGlobalLoading(true);

            const ii = new DataImageImport(images);
            ii.setNotify(notify);

            await ii.import();

        } catch (error) {
            notify(error);
        } finally {
            setGlobalLoading(false);
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-4 p-2">
            <div className="flex flex-col gap-1.5 capitalize">
                <div className="flex text-sm text-neutral-500">product image</div>
                <div className="flex flex-col gap-2 w-3xl">
                    <input
                        type="file"
                        accept=".zip"
                        onChange={handleChange}
                        className="file-input file-input-sm"
                    />

                    {
                        images.length > 0 &&
                        <button
                            onClick={handleImport}
                            disabled={loading}
                            className="btn btn-sm btn-primary w-xs"
                        >
                            import
                        </button>
                    }
                </div>
            </div>

            <div className="flex flex-col flex-wrap gap-5">
                {images.map((img, index) => (
                    <div key={index}>
                        <p>{img.name}</p>
                        <img
                            src={img.url}
                            alt={img.name}
                            className="w-xs h-xs min-w-xs min-h-xs"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageImport;