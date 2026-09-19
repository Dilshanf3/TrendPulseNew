export type MegaMenuColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type NavItem = {
  label: string;
  href: string;
  highlight?: boolean;
  columns?: MegaMenuColumn[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "New In", href: "/new-in" },
  {
    label: "Women",
    href: "/women",
    columns: [
      {
        title: "Clothing",
        links: [
          { label: "Dresses", href: "/women?category=dresses" },
          { label: "Tops", href: "/women?category=tops" },
          { label: "T-Shirts", href: "/women?category=t-shirts" },
          { label: "Blouses", href: "/women?category=blouses" },
          { label: "Jeans", href: "/women?category=jeans" },
          { label: "Pants", href: "/women?category=pants" },
          { label: "Skirts", href: "/women?category=skirts" },
          { label: "Activewear", href: "/women?category=activewear" },
        ],
      },
      {
        title: "Shoes",
        links: [
          { label: "Sneakers", href: "/women?category=sneakers" },
          { label: "Sandals", href: "/women?category=sandals" },
          { label: "Heels", href: "/women?category=heels" },
          { label: "Boots", href: "/women?category=boots" },
        ],
      },
      {
        title: "Accessories",
        links: [
          { label: "Bags", href: "/women?category=bags" },
          { label: "Jewelry", href: "/women?category=jewelry" },
          { label: "Belts", href: "/women?category=belts" },
          { label: "Sunglasses", href: "/women?category=sunglasses" },
        ],
      },
      {
        title: "Trending",
        links: [
          { label: "New Arrivals", href: "/new-in" },
          { label: "Best Sellers", href: "/women?sort=popular" },
          { label: "Sale", href: "/sale" },
        ],
      },
    ],
  },
  {
    label: "Men",
    href: "/men",
    columns: [
      {
        title: "Clothing",
        links: [
          { label: "Shirts", href: "/men?category=shirts" },
          { label: "T-Shirts", href: "/men?category=t-shirts" },
          { label: "Jeans", href: "/men?category=jeans" },
          { label: "Pants", href: "/men?category=pants" },
          { label: "Shorts", href: "/men?category=shorts" },
          { label: "Activewear", href: "/men?category=activewear" },
        ],
      },
      {
        title: "Shoes",
        links: [
          { label: "Sneakers", href: "/men?category=sneakers" },
          { label: "Boots", href: "/men?category=boots" },
        ],
      },
      {
        title: "Accessories",
        links: [
          { label: "Bags", href: "/men?category=bags" },
          { label: "Belts", href: "/men?category=belts" },
          { label: "Sunglasses", href: "/men?category=sunglasses" },
        ],
      },
    ],
  },
  { label: "Kids", href: "/kids" },
  { label: "Beauty", href: "/beauty" },
  { label: "Home", href: "/home" },
  { label: "Electronics", href: "/electronics" },
  { label: "Sale", href: "/sale", highlight: true },
];
