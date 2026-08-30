import { useState } from "react";
import type { Filament, Profile } from "../_utils/types";

export function usePrintSettings(profiles: Profile[], filaments: Filament[]) {
    const [profileId, setProfileId] = useState("");
    const [filamentId, setFilamentId] = useState("");
    const [infill, setInfill] = useState(15);
    const [supports, setSupports] = useState(false);

    const profile = profiles.find((p) => p.id === profileId) ?? profiles[0];
    const filament = filaments.find((f) => f.id === filamentId) ?? filaments[0];

    return {
        profileId,
        setProfileId,
        filamentId,
        setFilamentId,
        infill,
        setInfill,
        supports,
        setSupports,
        profile,
        filament,
    };
}

export type PrintSettings = ReturnType<typeof usePrintSettings>;
