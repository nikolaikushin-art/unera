export interface NavLink { text: string; href: string }
export interface NavLabel { label: string }
export type NavCell = NavLink | NavLabel;
export interface NavFeatured { href: string; title: string; text: string }
export interface NavPanel {
  id: string;
  title: string;
  titleHref: string | null;
  noFeat: boolean;
  cols: NavCell[][];
  featured: NavFeatured[];
}
export interface NavItem {
  label: string;
  href: string;
  wrapped: boolean;
  rail: { id: string; label: string }[];
  panels: NavPanel[];
}
