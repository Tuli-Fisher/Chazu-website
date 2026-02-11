import { LOCATIONS, USERS, MENU_ITEMS, INITIAL_ORDERS } from './mockData';

// Storage keys - prefix prevents conflicts with other apps
const STORAGE_KEYS = {
    ORDERS: 'chazu_orders',
    SESSION: 'chazu_session',
    AVAILABLE_ITEMS: 'chazu_available_items',
    LOCATIONS: 'chazu_locations',
    ALERTS: 'chazu_alerts',
};

// Initialize functionality
// Sets up default data in localStorage if missing (first-time visit)
export const initStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AVAILABLE_ITEMS)) {
        // Default to all items being available
        const allIds = MENU_ITEMS.map(i => i.id);
        localStorage.setItem(STORAGE_KEYS.AVAILABLE_ITEMS, JSON.stringify(allIds));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(LOCATIONS));
    }
};

// Auth
// Simple username/password check against mock data
// Returns session object if valid, null otherwise
export const loginUser = (username, password) => {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
        const session = {
            id: user.id,
            role: user.role,
            name: user.name,
            locationId: user.locationId
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        return session;
    }
    return null;
};

export const logoutUser = () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const getSession = () => {
    const s = localStorage.getItem(STORAGE_KEYS.SESSION);
    return s ? JSON.parse(s) : null;
};

// Data Access
// All data operations go through these functions
// Makes it easy to swap localStorage for a real API later
export const getOrders = () => {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
};

export const updateOrder = (updatedOrder) => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
        orders[index] = updatedOrder;
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return updatedOrder;
    }
    return null;
};

export const deleteOrder = (orderId) => {
    const orders = getOrders();
    const newOrders = orders.filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
};

export const getOrdersByLocation = (locationId) => {
    const orders = getOrders();
    return orders.filter(o => o.locationId === locationId);
};

export const createOrder = (order) => {
    const orders = getOrders();
    // Generate unique ID using timestamp
    const newOrder = {
        ...order,
        id: 'ord-' + Date.now(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        status: 'submitted',
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
};

export const getAvailableItemIds = () => {
    const data = localStorage.getItem(STORAGE_KEYS.AVAILABLE_ITEMS);
    if (!data) {
        const allIds = MENU_ITEMS.map(i => i.id);
        localStorage.setItem(STORAGE_KEYS.AVAILABLE_ITEMS, JSON.stringify(allIds));
        return allIds;
    }
    return JSON.parse(data);
};

export const saveAvailableItemIds = (ids) => {
    localStorage.setItem(STORAGE_KEYS.AVAILABLE_ITEMS, JSON.stringify(ids));
};

// Returns only menu items marked as available
export const getDailyMenu = () => {
    const availableIds = getAvailableItemIds();
    return MENU_ITEMS.filter(item => availableIds.includes(item.id));
};

export const getLocations = () => {
    const data = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    return data ? JSON.parse(data) : LOCATIONS;
};
export const saveLocations = (locations) => {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
};

// Alerts
// Broadcast messages from HQ to location managers
// When a location responds (places order), they're marked as responded
export const getAlerts = () => {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return data ? JSON.parse(data) : [];
};

export const createAlert = (alertText) => {
    const alerts = getAlerts();
    const newAlert = {
        id: 'alert-' + Date.now(),
        text: alertText,
        sentAt: new Date().toISOString(),
        active: true, // Only most recent is active
        respondedLocations: [] // Location IDs that have ordered since this alert
    };

    // Deactivate older alerts
    const updatedAlerts = alerts.map(a => ({ ...a, active: false }));
    updatedAlerts.push(newAlert);

    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updatedAlerts));
    return newAlert;
};

export const getLatestAlert = () => {
    const alerts = getAlerts();
    return alerts.length > 0 ? alerts[alerts.length - 1] : null; // Get the very last one
};

export const markAlertResponded = (alertId, locationId) => {
    const alerts = getAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.respondedLocations.includes(locationId)) {
        alert.respondedLocations.push(locationId);
        localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    }
};

// Returns ALL menu items (for admin management)
export const getMenuItems = () => MENU_ITEMS;
export const getUsers = () => USERS;
