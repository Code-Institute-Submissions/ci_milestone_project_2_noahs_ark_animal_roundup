//----------Initial Loader----------

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

//----------Ready Function----------

function ready() {
    let overlays = Array.from(docuemnt.getElementsbyClassName('overlay-text'));

}