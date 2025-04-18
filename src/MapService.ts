// ================================================
//  III  M   M  PPPP    OOO   RRRR   TTTTT   SSS
//   I   MM MM  P   P  O   O  R   R    T    S
//   I   M M M  P   P  O   O  R   R    T     SSS
//   I   M   M  PPPP   O   O  RRRR     T        S
//   I   M   M  P      O   O  R  R     T        S
//  III  M   M  P       OOO   R   R    T    SSSS
// ================================================
// * * * Imports



import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { showToast } from './util.ts';



// ====================================
//  TTTTT  Y   Y  PPPP   EEEEE   SSS
//    T    Y   Y  P   P  E      S
//    T     Y Y   P   P  EEE     SSS
//    T      Y    PPPP   E          S
//    T      Y    P      E          S
//    T      Y    P      EEEEE  SSSS
// ====================================
// * * * types



type MousePosition = {
    x: number,
    y: number,
    lat: number,
    lng: number,
}



// ================================================
//   SSS   EEEEE  RRRR   V   V  III   CCC   EEEEE
//  S      E      R   R  V   V   I   C   C  E
//   SSS   EEE    R   R  V   V   I   C      EEE
//      S  E      RRRR    V V    I   C      E
//      S  E      R  R    V V    I   C   C  E
//  SSSS   EEEEE  R   R    V    III   CCC   EEEEE
// ================================================
// * * * Service



export default class MapService {

    // utilisée pour le comportement Singleton du Service
    private static _instance: MapService;

    // statut du service
    // true -> service démarré, false -> service non démarré
    initialized: boolean = false;

    latElement = document.getElementById('lat-coord')
    lngElement = document.getElementById('lng-coord')

    // Points pour les itinéraires
    // startPoint = { lat: 0, lng: 0 }
    // endPoint = { lat: 0, lng: 0 }
    startPoint = { lat: 48.74402661853094, lng: -0.4005881941959615 }
    endPoint = { lat: 48.73828150868232, lng: -0.3915652430684986 }
    // startPoint = { lat: 8.681495, lng: 49.41461 }
    // endPoint = { lat: 8.687872, lng: 49.420318 }

    // marqueurs pour les itinéraires
    startMarker = new maplibregl.Marker({ color: '#ff0000' })
    endMarker = new maplibregl.Marker({ color: '#00ff00' })

    // instance de la carte maplibregl
    map: maplibregl.Map = null;

    // position de la souris sur le canva et la carte
    mousePosition: MousePosition = {
        x: Infinity,
        y: Infinity,
        lat: Infinity,
        lng: Infinity,
    };

    // constructeur privé à cause du Singleton
    private constructor() { }

    // renvoie une nouvelle instance du servive si celle-ci est nulle, renvoie l'instance dans l'autre cas
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    // 
    start(interactive: boolean = true): boolean {
        // vérifie si webgl est supporté par le navigateur
        if (!this._isWebglSupported()) return false;
        if (this.initialized) return false; // On n'initialise pas le service s'il l'est déjà

        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=pYqb4Ltcf5dTFU5W33id',
            center: [-0.3608859, 49.1843739],
            zoom: 12,
            interactive: interactive, // interactivité avec la carte (true: oui, false: non)
            maplibreLogo: true,
            rollEnabled: true, // active le Ctr+ clic droit et drag

        });

        this.startMarker
            .setLngLat([0, 0])
            .addTo(this.map)
        this.endMarker
            .setLngLat([0, 0])
            .addTo(this.map)

        // gestion des erreurs liées à la carte
        this.map.on('error', function (e) {
            // Vérifie si c'est une erreur liée au style
            // if (e && e.error && e.error.status === 404 && e.error.url.includes('style.json')) {
            console.log(e)
            if (e && e.error && e.error.url.includes('style.json')) {

                document.body.innerHTML = `
                    <div class="modal d-block" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <p class="text-danger">
                                        Le style de la carte n’a pas pu être chargé. Vérifiez l’URL ou le serveur de style
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                `
            } else {
                alert('Erreur MapLibre : ' + e.error || e);
            }
        });

        //   CONTROLES

        // zoom et boussole
        this.map.addControl(new maplibregl.NavigationControl({
            visualizePitch: true,
            visualizeRoll: true,
            showZoom: true,
            showCompass: true,
        }))

        // bouton plein écran
        this.map.addControl(new maplibregl.FullscreenControl({
            container: document.querySelector('body')
        }));


        // bouton localisation utilisateur
        this.map.addControl(
            new maplibregl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true
            })
        );


        // Met la position de la souris à jour à chaque fois qu'elle bouge sur la carte
        // x et y sont les coordonnées de la souris sur l'élément carte
        // lat et lng sont les coordonnées de la souris sur la carte
        this.map.on('mousemove', (e) => {
            this.mousePosition.x = e.point.x;
            this.mousePosition.y = e.point.y;
            this.mousePosition.lat = e.lngLat.wrap().lat;
            this.mousePosition.lng = e.lngLat.wrap().lng;

            this.latElement.innerText = e.lngLat.wrap().lat.toString()
            this.lngElement.innerText = e.lngLat.wrap().lng.toString()
        })

        // Toutes les initialisations sont terminées avec succès
        this.initialized = true;
        console.log(`%c MapService initialized successfully`, "color: lightgreen");
        return true;
    }

    stop(): boolean {
        this.initialized = false;
        return true;
    }

    setStartPoint() {
        this.startPoint.lat = this.mousePosition.lat
        this.startPoint.lng = this.mousePosition.lng
        this.startMarker.setLngLat([this.mousePosition.lng, this.mousePosition.lat])
    }

    setEndPoint() {
        this.endPoint.lat = this.mousePosition.lat
        this.endPoint.lng = this.mousePosition.lng
        this.endMarker.setLngLat([this.mousePosition.lng, this.mousePosition.lat])

    }


    addMarker(lat: number, lng: number) {
        if (!this.initialized) return false;
        // let marker = new maplibregl.Marker()
        new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(this.map);
        this.goToCoords(lat, lng);
        return true;
    }

    goToCoords(lat: number, lng: number): boolean {
        if (!this.initialized) return false;
        this.map.flyTo({
            center: [lng, lat],
            zoom: 5
        });
        return true;
    }

    calculerItineraire() {
        console.log(`calcul de l'itinéraire`)

        const body = {
            coordinates: [
                [this.startPoint.lng, this.startPoint.lat],
                [this.endPoint.lng, this.endPoint.lat]
            ],
            elevation: true,
            language: "fr-fr",
            radiuses: 1000
        }
        console.log(body.coordinates[0], body.coordinates[1])

        fetch(`https://api.openrouteservice.org/v2/directions/driving-car/geojson`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "5b3ce3597851110001cf6248c270bf2e94944fbe90b0b36e79d52eb2",
                "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                // console.log(response)
                if (!response.ok) {
                    showToast(`L'itinéraire n'a pas pu être calculé`, 4000, true)
                    throw new Error(`Erreur: ${response.status} : ${response.statusText}`)
                }
                return response.json()
            })
            .then(response => {

                // Supprimer les anciennes sources/couches s'il y en a
                if (this.map.getLayer('route')) {
                    this.map.removeLayer('route');
                }
                if (this.map.getSource('route')) {
                    this.map.removeSource('route');
                }

                this.map.addSource('route', {
                    type: 'geojson',
                    data: response
                });

                this.map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        // 'line-color': '#0074D9',
                        'line-color': '#ff0000',
                        'line-width': 4
                    }
                });

                // Zoomer sur l'itinéraire
                const coords = response.features[0].geometry.coordinates;
                const bounds = coords.reduce((b, coord) => b.extend(coord), new maplibregl.LngLatBounds(coords[0], coords[0]));
                this.map.fitBounds(bounds, { padding: 200 });

            })
            .catch(error => {
                // TODO Le toast d'erreur ne s'affiche pas en rouge
                console.error(`L'itinéraire n'a pas pu être calculé`, error)
                showToast(`L'itinéraire n'a pas pu être calculé`, 4000, true)
            })
    }


    private _isWebglSupported() {
        if (window.WebGLRenderingContext) {
            const canvas = document.createElement('canvas');
            try {
                const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
                if (context && typeof context.getParameter == 'function') {
                    return true;
                }
            } catch (e) {
                console.warn(`WebGL is supported but not enabled`);
            }
            return false;
        }
        // WebGL not supported
        console.warn(`WebGL is not supported`);
        return false;
    }
}

