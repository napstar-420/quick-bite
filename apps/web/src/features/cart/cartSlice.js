import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// Load cart data from localStorage if available
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      return JSON.parse(cartData);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return {
    items: [],
    activeBranchId: null,
    itemDetails: {}
  };
};

// Save cart data to localStorage
const saveCartToStorage = (cart) => {
  try {
    const { items, activeBranchId, itemDetails } = cart;
    localStorage.setItem('cart', JSON.stringify({
      items,
      activeBranchId,
      itemDetails
    }));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

// Load initial state from localStorage
const storedCart = loadCartFromStorage();

const initialState = {
  items: storedCart.items || [], // Array of objects: [{itemId, quantity}]
  activeBranchId: storedCart.activeBranchId || null, // Currently active branch
  loading: false,
  error: null,
  itemDetails: storedCart.itemDetails || {}, // Cache for item details
};

// Async thunk to fetch item details
export const fetchCartItemDetails = createAsyncThunk(
  "cart/fetchItemDetails",
  async (itemIds, { rejectWithValue }) => {
    try {
      // Convert itemIds to the correct format - array for the API
      // The API expects an array, so we need to ensure the URL is properly formatted
      const queryString = Array.isArray(itemIds) ? itemIds.join(',') : itemIds;
      const response = await axios.get(`/menu-items/by-ids?ids=${queryString}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return rejectWithValue(error.response?.data?.message || "Error fetching cart items");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { itemId, quantity = 1, branchId } = typeof action.payload === 'object'
        ? action.payload
        : { itemId: action.payload, quantity: 1 };

      // If this is the first item, set the active branch
      if (state.items.length === 0 && branchId) {
        state.activeBranchId = branchId;
      }

      // Prevent adding items from different branches
      if (state.activeBranchId && branchId && branchId !== state.activeBranchId) {
        // This would be handled in the component with a confirmation dialog
        return;
      }

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.itemId === itemId);

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist
        state.items.push({
          itemId,
          quantity
        });
      }

      // Save cart to localStorage
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;

      const existingItemIndex = state.items.findIndex(item => item.itemId === itemId);

      if (existingItemIndex !== -1) {
        if (quantity > 0) {
          // Update quantity
          state.items[existingItemIndex].quantity = quantity;
        } else {
          // Remove item if quantity is 0 or negative
          state.items.splice(existingItemIndex, 1);

          // If cart is now empty, clear active branch
          if (state.items.length === 0) {
            state.activeBranchId = null;
          }
        }

        // Save cart to localStorage
        saveCartToStorage(state);
      }
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.itemId !== itemId);

      // If cart is now empty, clear active branch
      if (state.items.length === 0) {
        state.activeBranchId = null;
      }

      // Save cart to localStorage
      saveCartToStorage(state);
    },
    setActiveBranch: (state, action) => {
      state.activeBranchId = action.payload;

      // Save cart to localStorage
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemDetails = {};
      state.activeBranchId = null;

      // Clear cart from localStorage
      localStorage.removeItem('cart');
    },
    replaceCart: (state, action) => {
      const { items, branchId } = action.payload;
      state.items = items || [];
      state.activeBranchId = branchId || null;

      // Save cart to localStorage
      saveCartToStorage(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItemDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItemDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Store item details in cache
        action.payload.forEach(item => {
          state.itemDetails[item._id] = item;
        });

        // Save cart with updated item details to localStorage
        saveCartToStorage(state);
      })
      .addCase(fetchCartItemDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart items";
      });
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setActiveBranch,
  replaceCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemIds = (state) => state.cart.items.map(item => item.itemId);
export const selectActiveBranchId = (state) => state.cart.activeBranchId;
export const selectCartItemCount = (state) =>
  Array.isArray(state.cart.items)
    ? state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
export const selectCartItemDetails = (state) => state.cart.itemDetails;
export const selectIsCartLoading = (state) => state.cart.loading;

// Helper selectors
export const selectItemInCart = (state, itemId) =>
  state.cart.items.find(item => item.itemId === itemId);

export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    const itemDetail = state.cart.itemDetails[item.itemId];
    if (itemDetail) {
      return total + (itemDetail.price * item.quantity);
    }
    return total;
  }, 0);
};

export default cartSlice.reducer;
