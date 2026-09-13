import "dotenv/config";
import { db } from "@/lib/db";
import { uploadObject } from "@/lib/storage";

const CATEGORY_HUES: Record<string, number> = {
    Decor: 275,
    Gadgets: 205,
    Garden: 145,
    Home: 18,
    Kitchen: 175,
    Office: 235,
    Tools: 30,
    "Toys & Games": 325,
};

function hash(value: string): number {
    let result = 0;

    for (const char of value) {
        result = (result * 31 + char.charCodeAt(0)) % 100000;
    }

    return result;
}

function escapeXml(value: string): string {
    return value.replace(/[<>&'"]/g, (char) => {
        switch (char) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            default:
                return "&quot;";
        }
    });
}

function initials(name: string): string {
    return name
        .split(/\s+/)
        .slice(0, 3)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");
}

function buildSvg(name: string, slug: string, category: string | null): string {
    const base = (category ? CATEGORY_HUES[category] : undefined) ?? 200;
    const hue = (base + (hash(slug) % 40) - 20 + 360) % 360;
    const accent = (hue + 40) % 360;
    const label = name.length > 24 ? `${name.slice(0, 23)}…` : name;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 65% 88%)"/>
      <stop offset="1" stop-color="hsl(${accent} 70% 62%)"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="660" cy="150" r="220" fill="hsl(${accent} 80% 96%)" opacity="0.35"/>
  <circle cx="130" cy="690" r="180" fill="hsl(${hue} 80% 40%)" opacity="0.18"/>
  <text x="400" y="390" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="220" font-weight="700" fill="hsl(${hue} 45% 25%)" opacity="0.9">${escapeXml(initials(name))}</text>
  <text x="400" y="520" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="46" font-weight="600" fill="hsl(${hue} 45% 22%)">${escapeXml(label)}</text>
</svg>`;
}

async function main() {
    const products = await db.product.findMany({
        where: { images: { none: {} } },
        select: { id: true, name: true, slug: true, category: { select: { name: true } } },
        orderBy: { name: "asc" },
    });

    console.log(`Generating placeholder images for ${products.length} products`);

    for (const product of products) {
        const key = `products/${product.id}/placeholder.svg`;
        const svg = buildSvg(product.name, product.slug, product.category?.name ?? null);

        await uploadObject(key, Buffer.from(svg), "image/svg+xml");
        await db.productImage.create({
            data: { productId: product.id, key, alt: product.name, sortOrder: 0 },
        });

        console.log(`  ✓ ${product.name}`);
    }

    console.log("Done.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
