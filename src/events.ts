
// Clic
// document.addEventListener('click', function(e) {
//     console.log(e);
// })



const contextMenu = document.getElementById('contextMenu');


// Clic droit de la souris
if (document.addEventListener) {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        console.log(`clic droit`);
    }, false);
} else {
    console.warn(`Nope, le clic droit ne marche pas`);
}


// @ts-ignore
document.getElementById('cst_ctxmn_add_marker').addEventListener('click', (e) => {
    console.log('addMarker()')
})
// @ts-ignore
document.getElementById('cst_ctxmn_save').addEventListener('click', (e) => {
    console.log('save()')
})

// @ts-ignore
document.getElementById('cst_ctxmn_view').addEventListener('click', (e) => {
    console.log('view()')
})