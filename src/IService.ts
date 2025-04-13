export default interface IService {
    initialized: boolean;
    start: () => boolean;
    stop: () => boolean;
}

