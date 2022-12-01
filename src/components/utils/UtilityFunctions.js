import { useEffect, useRef } from "react";

function capitalizeFirstLetter (str, every_word = false) {
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

    if (every_word) {
        const arr = str.split(" ");
        const cap_arr = arr.map(s => capitalize(s));

        return cap_arr.join(" ");
    }

    return capitalize(str);
}

export {capitalizeFirstLetter};