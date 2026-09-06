import {
  BookOpen,
  PillBottle,
  CircleDot,
  Droplets,
  FlaskConical,
  Pill,
  SprayCan,
  type LucideIcon,
} from "lucide-react";

import type { ProductType } from "../types/product";

export const PRODUCT_TYPE_ICONS: Record<ProductType, LucideIcon> = {
  TABLET: Pill,
  DRINK: PillBottle,
  SYRUP: FlaskConical,
  OIL: Droplets,
  CREAM: SprayCan,
  CELL_SALT: CircleDot,
  BOOK: BookOpen,
  SUPPOSITORY: Pill,
};
