export type SellItem = {
    text: string;
    avoid?: boolean;
};

export type SellSection = {
    title: string;
    subtitle: string;
    rule: string;
    items: SellItem[];
};

export type RhythmStep = {
    when: string;
    action: string;
};

export type RhythmSection = {
    title: string;
    subtitle: string;
    steps: RhythmStep[];
};

export type LeadTimeRow = {
    item: string;
    promise: string;
    note: string;
};

export type LeadTimeSection = {
    title: string;
    subtitle: string;
    rows: LeadTimeRow[];
};

export type CapacityRule = {
    title: string;
    text: string;
};

export type CapacitySection = {
    title: string;
    subtitle: string;
    rules: CapacityRule[];
};
