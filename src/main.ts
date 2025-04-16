
import { showToast } from './util.ts';

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();

    const menu = document.getElementById('custom-context-menu');

    // Positionner le menu au niveau du clic
    menu.style.top = `${e.pageY}px`;
    menu.style.left = `${e.pageX}px`;

    // Afficher le menu
    menu.classList.remove('d-none');
});

// Masquer le menu si on clique ailleurs
document.addEventListener('click', function () {
    const menu = document.getElementById('custom-context-menu');
    menu.classList.add('d-none');
});



/**********************************/
/*                                */
/*   CHARGEMENT DES DÉPENDANCES   */
/*                                */
/**********************************/

// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import MapService from "./MapService.ts";

const mapService = MapService.Instance;

// mapService.start();
mapService.start();



document.getElementById('cst_ctxmn_start_point')?.addEventListener('click', () => {
    mapService.setStartPoint()
})
document.getElementById('cst_ctxmn_end_point')?.addEventListener('click', () => {
    mapService.setEndPoint()
})
document.getElementById('cst_ctxmn_add_marker')?.addEventListener('click', () => {
    alert(`ajout d'un marqueur`)
})
document.getElementById('cst_ctxmn_save_img')?.addEventListener('click', () => {
    alert(`capture de la carte`)
})
document.getElementById('btn-itineraire').addEventListener('click', () => {
    mapService.calculerItineraire()
})


// Regex pour des coordonnées de la forme xxx.xxxxx;xxx.xxxxx
// ^-?\d{1,3}(\.\d{0,18})?;-?\d{1,3}(\.\d{0,18})?$



// Copie des coordonnées dans le presse-papier lors du clic sur div#coordinates
document.getElementById('coordinates').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText("hello world");
        showToast("Coordonnées copiées dans le presse-papier");
    } catch (err) {
        console.error('Erreur lors de la copie :', err);
    }
});



