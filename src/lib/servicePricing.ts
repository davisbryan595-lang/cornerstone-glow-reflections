export const SERVICE_PRICING: Record<string, number> = {
  "paint-correction": 29999, // $299.99 in cents
  "auto-detailing": 24999, // $249.99 in cents
  "headlight-trim-restoration": 19999, // $199.99 in cents
  "custom": 0, // Custom pricing - user will need to contact
};

export const SERVICE_NAMES: Record<string, string> = {
  "paint-correction": "Paint Correction",
  "auto-detailing": "Auto Detailing",
  "headlight-trim-restoration": "Headlight & Trim Restoration",
  "custom": "Custom Package",
};

export const getServicePrice = (serviceId: string): number | null => {
  const price = SERVICE_PRICING[serviceId];
  return price !== undefined && price > 0 ? price : null;
};

export const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};
