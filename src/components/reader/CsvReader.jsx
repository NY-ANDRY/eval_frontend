import { useEffect, useState } from "react";
import Papa from "papaparse";
import JsonView from "@uiw/react-json-view";

const CsvReader = ({ onRead, header = true, show = true }) => {
    const [csvData, setCsvData] = useState({});
    const [file, setFile] = useState(null);

    const handleRead = (event) => {
        if (!file) {
            alert("My friend, I need file");
            return;
        }
        Papa.parse(file, {
            header: header, // maka ligne voloany -> avadiny indice ho an'ny ambony rehetra
            skipEmptyLines: true,
            delimiter: null,
            complete: (results) => {
                onRead(results);
                setCsvData(results);
            },
        });
    };

    const handleChangeFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

    useEffect(() => {
        if (file) {
            handleRead();
        }
    }, [file]);

    return (
        <div className="flex flex-col gap-1 w-full">
            <input onChange={handleChangeFile} type="file" accept=".csv" className="file-input file-input-sm" />
            {show && <JsonView value={csvData} collapsed={true} />}
        </div>
    )
}

export default CsvReader;