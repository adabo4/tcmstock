import {
  BookOpen,
  PillBottle,
  CircleDot,
  Droplets,
  FlaskConical,
  Pill,
  SprayCan,
  type LucideIcon,
  Tablets,
} from "lucide-react";

import type { ProductType } from "../types/product";

export const PRODUCT_TYPE_ICONS: Record<ProductType, LucideIcon> = {
  TABLET: Tablets,
  DRINK: PillBottle,
  SYRUP: FlaskConical,
  OIL: Droplets,
  CREAM: SprayCan,
  CELL_SALT: CircleDot,
  BOOK: BookOpen,
  SUPPOSITORY: Pill,
};
