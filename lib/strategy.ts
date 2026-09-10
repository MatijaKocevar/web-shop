import type {
    CapacitySection,
    LeadTimeSection,
    RhythmSection,
    SellSection,
} from "@/lib/strategy.types";

export const sellSection: SellSection = {
    title: "What to sell",
    subtitle: "Sell what the machine is good at: small, fast, repeatable.",
    rule: "≤ 2 h print · ≤ 60 g · near-zero failure rate",
    items: [
        { text: "Vase-mode plant pots & pen cups — 40 min, ~40 g, huge margin" },
        { text: "Cable clips, desk organizers, phone & tablet stands" },
        { text: "Controller stands, SD-card cases, keychains, wall hooks" },
        { text: "Board-game inserts, gridfinity organizers" },
        { text: "Custom replacement parts & name plates — your real moat" },
        { text: "Articulated dragons, helmets, large vases", avoid: true },
        { text: "Multicolor prints — machine time & failure risk", avoid: true },
        { text: "Anything tying up the printer for over 2 hours", avoid: true },
    ],
};

export const rhythmSection: RhythmSection = {
    title: "Weekly rhythm",
    subtitle: "One printer, two kinds of days.",
    steps: [
        {
            when: "Office days (3×)",
            action: "Start a full plate of validated prints before you leave — that's 10 unattended hours. Watch it via Creality Cloud, kill power remotely if it fails. Second batch overnight.",
        },
        {
            when: "Home days (2×)",
            action: "Slice and QA new custom orders. Print customer STLs while you watch the first layer. Answer messages.",
        },
        {
            when: "Evenings",
            action: "Swap plates, start the overnight batch. Validated models only — never a customer's first print.",
        },
        {
            when: "Weekend",
            action: "Stock marathon: pre-print bestsellers so they ship next day.",
        },
    ],
};

export const leadTimeSection: LeadTimeSection = {
    title: "Lead times",
    subtitle: "Under-promise, over-deliver. The buffer is your friend.",
    rows: [
        {
            item: "Custom prints",
            promise: "Ships in 5 business days",
            note: "The buffer absorbs failed prints and office-day surprises",
        },
        {
            item: "Stock items",
            promise: "Ships in 1–2 days",
            note: "Pre-printed during idle and overnight time",
        },
        {
            item: "Unattended runs",
            promise: "Validated models only",
            note: "New STLs always print while you can watch the first layer",
        },
    ],
};

export const capacitySection: CapacitySection = {
    title: "Capacity & pricing",
    subtitle: "Numbers that keep one printer honest.",
    rules: [
        {
            title: "Capacity",
            text: "Attended: 12–16 machine-hours a day ≈ 6–10 small items. Office days add 10 unattended hours each.",
        },
        {
            title: "The cap rule",
            text: "Queue projects past 3 days → deactivate catalog items or raise prices. Never over-sell one printer.",
        },
        {
            title: "Scrap is real",
            text: "Failed prints burn filament too. Always log them with reason FAILURE so stock stays honest.",
        },
        {
            title: "Reorder point",
            text: "Buy more when a color drops below 500 g. Start: PLA black ×2, white ×2, one hero color ×2, PETG ×1.",
        },
    ],
};
