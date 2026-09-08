export type Profile = {
    id: string;
    printerId: string;
    name: string;
    nozzle: number;
    layerHeight: number;
    infill: number;
    speed: number | null;
    machineHourRate: number;
    setupFee: number;
    supports: boolean;
    active: boolean;
};
