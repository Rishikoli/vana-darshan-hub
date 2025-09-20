import { configureStore } from '@reduxjs/toolkit';

// Simple dashboard state management without Kepler.gl initially
interface DashboardState {
  selectedVillage: any;
  mapConfig: any;
}

const initialState: DashboardState = {
  selectedVillage: null,
  mapConfig: null
};

// Dashboard reducer
const dashboardReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_SELECTED_VILLAGE':
      return { ...state, selectedVillage: action.payload };
    case 'SET_MAP_CONFIG':
      return { ...state, mapConfig: action.payload };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;