import { useEffect, useState } from "react";
import { getSecondBetween } from "../../lib/utils.js";

const Home = () => {

    const [test, setTest] = useState("");

    useEffect(() => {
        let d1 = new Date("2026-01-01T08:00:00");
        let d2 = new Date("2026-01-02T11:00:00");

        setTest(getSecondBetween(d1, d2));
    }, [])

    const [inputTest, setInputTest] = useState(false);
    useEffect(() => {
        console.log(inputTest);
        
    }, [inputTest])

    return (
        <div className="flex flex-col">
            <div className="flex">
            {test}
            </div>
            <div className="flex">
                <input onChange={(e) => setInputTest(e.target.checked)} type="checkbox" className="checkbox" />
            </div>
        </div>
    )
}

export default Home;    