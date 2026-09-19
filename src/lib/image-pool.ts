const UNSPLASH_BASE = "https://images.unsplash.com/photo-";

function unsplash(id: string, w: number, h: number) {
  return `${UNSPLASH_BASE}${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

const WOMEN_IDS = [
  "1445205170230-053b83016050",
  "1490481651871-ab68de25d43d",
  "1441984904996-e0b6ba687e04",
  "1489987707025-afc232f7ea0f",
  "1516762689617-e1cffcef479d",
  "1515372039744-b8f02a3ae446",
  "1520975954732-35dd22299614",
  "1550928431-ee0ec6db30d3",
  "1503341504253-dff4815485f1",
  "1521572163474-6864f9cf17ab",
  "1544441893-675973e31985",
  "1524250502761-1ac6f2e30d43",
  "1583744946564-b52ac1c389c8",
  "1591047139829-d91aecb6caea",
  "1591195853828-11db59a44f6b",
];

const MEN_IDS = [
  "1508427953056-b00b8d78ebf5",
  "1556905055-8f358a7a47b2",
  "1622519407650-3df9883f76a5",
  "1584917865442-de89df76afd3",
  "1512436991641-6745cdb1723f",
  "1490578474895-699cd4e2cf59",
  "1560243563-062bfc001d68",
  "1600185365483-26d7a4cc7519",
  "1600180758890-6b94519a8ba6",
  "1522335789203-aabd1fc54bc9",
  "1560343090-f0409e92791a",
  "1602810318383-e386cc2a3ccf",
  "1509631179647-0177331693ae",
  "1571908599407-cdb918ed83bf",
  "1523381210434-271e8be1f52b",
];

const KIDS_IDS = [
  "1618354691373-d851c5c3a990",
  "1487222477894-8943e31ef7b2",
  "1479064555552-3ef4979f8908",
  "1523398002811-999ca8dec234",
  "1503602642458-232111445657",
  "1618886614638-80e3c103d31a",
];

const BEAUTY_IDS = [
  "1552374196-c4e7ffc6e126",
  "1543163521-1bf539c55dd2",
  "1611652022419-a9419f74343d",
  "1541099649105-f69ad21f3246",
  "1519415943484-9fa1873496d4",
];

const HOME_IDS = [
  "1542291026-7eec264c27ff",
  "1560769629-975ec94e6a86",
  "1596755094514-f87e34085b2c",
  "1533827432537-70133748f5c8",
  "1607346256330-dee7af15f7c5",
];

const ELECTRONICS_IDS = [
  "1560472354-b33ff0c44a43",
  "1519741497674-611481863552",
  "1523275335684-37898b6baf30",
  "1594633312681-425c7b97ccd1",
];

const CATEGORY_POOLS: Record<string, string[]> = {
  women: WOMEN_IDS,
  men: MEN_IDS,
  kids: KIDS_IDS,
  beauty: BEAUTY_IDS,
  home: HOME_IDS,
  electronics: ELECTRONICS_IDS,
};

const ALL_IDS = [...WOMEN_IDS, ...MEN_IDS, ...KIDS_IDS, ...BEAUTY_IDS, ...HOME_IDS, ...ELECTRONICS_IDS];

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Deterministically pick a fashion-relevant Unsplash photo for a given category + seed. */
export function pickCategoryImage(categorySlug: string, seed: string, w = 900, h = 1200) {
  const pool = CATEGORY_POOLS[categorySlug.toLowerCase()] ?? ALL_IDS;
  const id = pool[hashSeed(seed) % pool.length];
  return unsplash(id, w, h);
}

/** Deterministically pick two distinct photos (primary + hover) for a product card. */
export function pickProductImages(categorySlug: string, seed: string, w = 900, h = 1200) {
  const pool = CATEGORY_POOLS[categorySlug.toLowerCase()] ?? ALL_IDS;
  const base = hashSeed(seed);
  const primary = pool[base % pool.length];
  const hover = pool[(base + 1) % pool.length];
  const third = pool[(base + 2) % pool.length];
  return [unsplash(primary, w, h), unsplash(hover, w, h), unsplash(third, w, h)];
}

export const FALLBACK_IMAGE = unsplash(WOMEN_IDS[0], 900, 1200);

export const HERO_IMAGE = unsplash("1490481651871-ab68de25d43d", 1600, 1000);
export const PROMO_IMAGE = unsplash("1521572163474-6864f9cf17ab", 1400, 500);

export const CATEGORY_TILE_IDS: Record<string, string> = {
  women: WOMEN_IDS[2],
  men: MEN_IDS[2],
  kids: KIDS_IDS[1],
  beauty: BEAUTY_IDS[1],
  home: HOME_IDS[1],
};

export function pickCategoryTileImage(categorySlug: string, w = 500, h = 650) {
  const id = CATEGORY_TILE_IDS[categorySlug.toLowerCase()] ?? WOMEN_IDS[0];
  return unsplash(id, w, h);
}
