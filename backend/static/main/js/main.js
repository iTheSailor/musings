const lightMode = {
'--color_primary': '#687864',
'--color_secondary': '#31708E',
'--color_tertiary': '#5085A5',
'--color_quaternary': '#8FC1E3',
'--color_quinary': '#efefef',
'--footer_text_color': '#efefef',
'--body_text_color': '#1d1d1d',
};

const darkMode = {
'--color_primary': '#34463E',
'--color_secondary': '#204c59',
'--color_tertiary': '#2C4B59',
'--color_quaternary': '#4B6C8A',
'--color_quinary': '#2a2929',
'--footer_text_color': '#efefef',
'--body_text_color': '#b5b2b2',
};

let isDarkMode = false;



const colorMode = document.getElementById('colorMode');


// passive event listener
document.addEventListener('DOMContentLoaded', () => {

    colorMode.addEventListener('change', () => {
        if (colorMode.checked) {
            for (const key in lightMode) {
                document.documentElement.style.setProperty(key, lightMode[key]);
            }
            localStorage.setItem('mode', 'dark');
            isDarkMode = true;
        } else {
            for (const key in darkMode) {
                document.documentElement.style.setProperty(key, darkMode[key]);
            }
            localStorage.setItem('mode', 'light');
            isDarkMode = false;
        }
    });

    if (localStorage.getItem('mode') === 'dark') {
        colorMode.checked = true;
        for (const key in lightMode) {
            document.documentElement.style.setProperty(key, lightMode[key]);
        }
        isDarkMode = true;
    } else {
        for (const key in darkMode) {
            document.documentElement.style.setProperty(key, darkMode[key]);
        }
        isDarkMode = false;
    }
}

);
