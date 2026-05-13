import { useState } from "react";
import * as XLSX from "xlsx";

const XlsxReader = ({ onRead, sheet }) => {
    const [csvData, setCsvData] = useState([]);
    const [file, setFile] = useState(null);
    const [sheets, setSheets] = useState([]);
    const [fileContent, setFileContent] = useState(null);

    const handleSelectSheets = (sheetName) => {
        if (!fileContent) {
            return;
        }
        const sheetTarget = fileContent.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheetTarget);
        onRead(jsonData);
    }

    const handleRead = (event) => {
        if (!file) {
            alert("My friend, I need file");
            return;
        }

        const reader = new FileReader();

        reader.onload = (evt) => {
            const binaryStr = evt.target.result;

            const workbook = XLSX.read(binaryStr, {
                type: "binary",
            });

            setFileContent(workbook);
            setSheets(workbook.SheetNames);
        };

        reader.readAsBinaryString(file);
    };

    const handleChangeFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 w-fit">
                <input onChange={handleChangeFile} type="file" accept=".xlsx" className="file-input file-input-sm" />
                <button onClick={handleRead} className="btn btn-sm btn-neutral">read</button>
            </div>
            <div className="flex items-center gap-2">
                {sheets && sheets.map((sheet, i) => (
                    <button onClick={() => { handleSelectSheets(sheet) }} key={i} className="btn btn-neutral btn-xs">
                        {sheet}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default XlsxReader;