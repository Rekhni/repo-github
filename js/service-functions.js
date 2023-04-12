// Функции либо общие, либо не относящиеся ни к какому объекту.
import { format } from "date-fns";

function safeInput(str) {
    return str.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

function getDate(date) {

    const newDate = new Date(date);
    return format(newDate, 'dd.MM.yyyy hh:mm');
}

function validate(input, text) {
    if (input.value === '' || input.value === '\n') {
        input.classList.add('error__name');
        input.placeholder = "Input can't be empty ";
        input.value = '';
        setTimeout(() => {
            input.classList.remove('error__name')
            input.placeholder = `Write ${text}`;
        }, 1500);
    } else {
        return true;
    }
}

export { validate, getDate, delay, safeInput };