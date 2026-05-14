``` jsx
import { useState } from "react";

const UploadImage = () => {
    const [image, setImage] = useState<File | null>(null);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            setImage(file);
        }
    };

    const sendImage = async () => {
        if (!image) {
            console.log("Aucune image sélectionnée");
            return;
        }

        const formData = new FormData();

        // "image" = nom attendu par le backend
        formData.append("image", image);

        try {
            const response = await fetch(
                "http://localhost:8000/api/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            <button onClick={sendImage}>
                Envoyer image
            </button>
        </div>
    );
};

export default UploadImage;
```