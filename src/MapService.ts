/*   IMPORTS   */
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import IService from "./IService.ts";

/*   TYPES   */
export type Coords = [latitude: number, longitude: number];

/*   SERVICE   */
export default class MapService implements IService {

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
    startMarker = new maplibregl.Marker()
    endMarker = new maplibregl.Marker()

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
            // style: 'https://demotiles.maplibre.org/style.json',
            style: 'http://localhost:8080/styles/basic-preview/style.json',
            // center: [2.2137, 46.2276],
            zoom: 15,
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
                                    <p>
                                        Vous pouvez lancer le serveur de style via la commande <span class="bg-secondary text-light">npm run map</span>
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


        // Attendre que la carte soit chargée pour récupérer la position de l'utilisateur
        this.map.on('load', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (location) => {
                        const coords: Coords = [location.coords.latitude, location.coords.longitude];
                        // Centrer la carte sur la position de l'utilisateur
                        this.map.setCenter([coords[1], coords[0]]);
                        // Ajouter un marqueur sur cette position
                        new maplibregl.Marker()
                            .setLngLat([coords[1], coords[0]])
                            .addTo(this.map);
                    },
                    (error) => {
                        console.error("Erreur lors de la récupération de la géolocalisation :", error);
                        this.map.setCenter([-0.350000, 49.183333]) // Coordonnées de la ville de Caen
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                console.warn("La géolocalisation n'est pas supportée par ce navigateur.");
                this.map.setCenter([-0.350000, 49.183333]) // Coordonnées de la ville de Caen
            }
        });

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


        this.map.on('load', () => {
            this.testLayer();
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

    testLayer() {
        if (!this.initialized) return false;

        if (this.map) {

            this.map.addSource('test', {
                type: 'geojson',
                data: {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'MultiPoint',
                                'coordinates': [
                                    [0.0, 0.0],
                                    [0.0, 1.0],
                                    [0.0, 2.0],
                                ]
                            },
                            'properties': {} // Ajoutez des propriétés si besoin
                        }
                    ]
                }
            })

            this.map.addLayer({
                id: 'test',
                type: 'circle',
                source: 'test',
                paint: {
                    "circle-radius": 6,
                    'circle-color': '#007cbf',
                }
            })
        }
    }

    calculerItineraire() {
        // const params =
        //     new URLSearchParams({
        //         api_key: "5b3ce3597851110001cf6248c270bf2e94944fbe90b0b36e79d52eb2",
        //         start: `${this.startPoint.lat},${this.startPoint.lng}`,
        //         end: `${this.endPoint.lat},${this.endPoint.lng}`,
        //     })

        // const body = {
        //     coordinates: [
        //         [this.startPoint.lng, this.startPoint.lat],
        //         [this.endPoint.lng, this.endPoint.lat]
        //     ],
        //     radiuses: [1000, 1000],

        // }

        // fetch(`https://api.openrouteservice.org/v2/directions/driving-car?${params.toString()}`, {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": "application/json; charset=utf-8",
        //         "Authorization": "5b3ce3597851110001cf6248c270bf2e94944fbe90b0b36e79d52eb2",
        //         "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
        //     },
        //     body: {

        //     }
        // })
        //     .then(response => {
        //         // console.log(response)
        //         if (!response.ok) {
        //             // console.log(`là y'a une erreur`)
        //             // alert(`Erreur: ${response.status} : ${response.}`)
        //             throw new Error(`Erreur: ${response.status} : ${response.statusText}`)
        //             // return
        //         }
        //         return response.json()
        //     })
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(error => console.error(`Erreur : la requête pour l'itinéraire a échoué`, error))
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


type MousePosition = {
    x: number,
    y: number,
    lat: number,
    lng: number,
}