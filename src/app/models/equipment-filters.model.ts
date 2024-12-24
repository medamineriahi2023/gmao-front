export interface EquipmentFilters {
  search: string;
  statuses: string[];
  categories: string[];
  sites: string[];
  maintenanceDateRange: {
    start: Date | null;
    end: Date | null;
  };
}
