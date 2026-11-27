import { LucideIcon } from "lucide-react";

import * as Icons from "lucide-react";

export const getIconComponensts = (iconName: string): LucideIcon => {
  const IconComponents = Icons[iconName as keyof typeof Icons];

  if (!IconComponents) {
    return Icons.HelpCircle;
  }

  return IconComponents as LucideIcon;
};
