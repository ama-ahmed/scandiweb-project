import cartSlice  from "./cartSlice";
import { persistStore, persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "cart",
  storage,
};

const cartReducer = persistReducer(persistConfig, cartSlice);


// const store = createStore(cartReducer);
const store = configureStore({
	reducer: {
		cart: cartReducer,
	},
	middleware: getDefaultMiddleware => 
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
	
});
export const persistor = persistStore(store);


export default store
