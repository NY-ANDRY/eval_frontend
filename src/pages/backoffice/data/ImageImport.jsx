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
        <div className="flex gap-28">
            <div className="flex flex-col gap-1.5 capitalize w-fit">
                <div className="flex text-sm text-neutral-500">product image</div>
                <div className="flex flex-col gap-2">
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

            <div className="flex flex-wrap gap-4">
                {images.map((img, index) => (
                    <div key={index} className="flex flex-col gap-2 border border-neutral-200 rounded-sm p-2">
                        <img
                            src={img.url}
                            alt={img.name}
                            className="w-28 h-28 min-w-28 min-h-28 rounded-sm"
                        />
                        <div className="max-w-28 truncate text-neutral-800 text-sm">{img.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageImport;