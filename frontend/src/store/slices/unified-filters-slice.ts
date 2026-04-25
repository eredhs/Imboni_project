import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UnifiedFilterState, FilterRole } from "@/lib/unified-filter-types";
import { DEFAULT_FILTER_STATE, cloneFilterState, getResetFilters } from "@/lib/unified-filter-types";

interface UnifiedFiltersReducerState {
  job_seeker: UnifiedFilterState;
  recruiter: UnifiedFilterState;
}

const initialState: UnifiedFiltersReducerState = {
  job_seeker: { ...DEFAULT_FILTER_STATE, role: "job_seeker" },
  recruiter: { ...DEFAULT_FILTER_STATE, role: "recruiter" },
};

export const unifiedFiltersSlice = createSlice({
  name: "unifiedFilters",
  initialState,
  reducers: {
    // Update entire filter state for a role
    setFilters: (
      state,
      action: PayloadAction<{ role: FilterRole; filters: UnifiedFilterState }>
    ) => {
      state[action.payload.role] = action.payload.filters;
    },

    // Update a single filter set
    toggleFilter: (
      state,
      action: PayloadAction<{
        role: FilterRole;
        filterType: keyof UnifiedFilterState;
        value: string;
      }>
    ) => {
      const { role, filterType, value } = action.payload;
      const filters = state[role];

      if (
        typeof filters[filterType] === "object" &&
        "has" in (filters[filterType] as any)
      ) {
        const newSet = new Set(filters[filterType] as any);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        (filters[filterType] as any) = newSet;
      }
      filters.lastUpdated = new Date();
    },

    // Update search query
    setSearchQuery: (
      state,
      action: PayloadAction<{ role: FilterRole; query: string }>
    ) => {
      state[action.payload.role].searchQuery = action.payload.query;
      state[action.payload.role].lastUpdated = new Date();
    },

    // Update sort option
    setSortBy: (
      state,
      action: PayloadAction<{
        role: FilterRole;
        sortBy: UnifiedFilterState["sortBy"];
      }>
    ) => {
      state[action.payload.role].sortBy = action.payload.sortBy;
      state[action.payload.role].lastUpdated = new Date();
    },

    // Clear all filters
    clearAllFilters: (state, action: PayloadAction<FilterRole>) => {
      state[action.payload] = getResetFilters(action.payload);
    },

    // Remove single filter
    removeFilter: (
      state,
      action: PayloadAction<{
        role: FilterRole;
        filterType: keyof UnifiedFilterState;
        value: string;
      }>
    ) => {
      const { role, filterType, value } = action.payload;
      const filters = state[role];

      if (
        typeof filters[filterType] === "object" &&
        "has" in (filters[filterType] as any)
      ) {
        const newSet = new Set(filters[filterType] as any);
        newSet.delete(value);
        (filters[filterType] as any) = newSet;
      }
      filters.lastUpdated = new Date();
    },

    // Bulk add filters
    addFilters: (
      state,
      action: PayloadAction<{
        role: FilterRole;
        filters: Partial<UnifiedFilterState>;
      }>
    ) => {
      const { role, filters } = action.payload;
      const currentFilters = state[role];

      Object.entries(filters).forEach(([key, value]) => {
        if (
          key !== "lastUpdated" &&
          key !== "role" &&
          typeof value === "object" &&
          "size" in (value as any)
        ) {
          const existingSet = currentFilters[key as keyof UnifiedFilterState];
          if (typeof existingSet === "object" && "size" in existingSet) {
            (currentFilters[key as keyof UnifiedFilterState] as any) = new Set([
              ...(existingSet as any),
              ...(value as any),
            ]);
          }
        }
      });

      currentFilters.lastUpdated = new Date();
    },

    // Sync filters between roles (e.g., when HR creates a filter set for seekers to use)
    syncFilters: (
      state,
      action: PayloadAction<{
        from: FilterRole;
        to: FilterRole;
      }>
    ) => {
      const { from, to } = action.payload;
      state[to] = cloneFilterState(state[from]);
    },

    // Load filters from URL or saved state
    loadFilters: (
      state,
      action: PayloadAction<{
        role: FilterRole;
        filters: Partial<UnifiedFilterState>;
      }>
    ) => {
      const { role, filters } = action.payload;
      state[role] = {
        ...state[role],
        ...filters,
        lastUpdated: new Date(),
      };
    },
  },
});

export const {
  setFilters,
  toggleFilter,
  setSearchQuery,
  setSortBy,
  clearAllFilters,
  removeFilter,
  addFilters,
  syncFilters,
  loadFilters,
} = unifiedFiltersSlice.actions;

export default unifiedFiltersSlice.reducer;

// Selectors
export const selectJobSeekerFilters = (state: any) =>
  state.unifiedFilters.job_seeker;
export const selectRecruiterFilters = (state: any) =>
  state.unifiedFilters.recruiter;
export const selectFiltersByRole = (role: FilterRole) => (state: any) =>
  state.unifiedFilters[role];
