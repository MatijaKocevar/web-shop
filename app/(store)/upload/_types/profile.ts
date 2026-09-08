export type Profile = {
    id: string;
    name: string;
    nozzle: number;
    layerHeight: number;
    infill: number;
    speed: number | null;
    machineHourRate: number;
    setupFee: number;
    printer: {
        id: string;
        name: string;
        buildX: number;
        buildY: number;
        buildZ: number;
    };
};
