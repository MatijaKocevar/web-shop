export type PrinterWithProfiles = {
    id: string;
    name: string;
    buildX: number;
    buildY: number;
    buildZ: number;
    profiles: {
        id: string;
        name: string;
        layerHeight: number;
        infill: number;
        speed: number | null;
        machineHourRate: number;
    }[];
};
