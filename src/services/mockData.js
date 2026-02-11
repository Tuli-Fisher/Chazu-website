export const LOCATIONS = [
    { id: 'loc-1', name: 'Downtown Branch' },
    { id: 'loc-2', name: 'Westside Campus' },
    { id: 'loc-3', name: 'Uptown Hub' },
];

export const USERS = [
    { id: 'u1', username: 'admin', password: '123', role: 'OVERALL_MANAGER', name: 'Sarah Smith' },
    { id: 'u2', username: 'mgr1', password: '123', role: 'LOCATION_MANAGER', locationId: 'loc-1', name: 'John Doe' },
    { id: 'u3', username: 'mgr2', password: '123', role: 'LOCATION_MANAGER', locationId: 'loc-2', name: 'Jane Roe' },
    { id: 'u4', username: 'mgr3', password: '123', role: 'LOCATION_MANAGER', locationId: 'loc-3', name: 'Bob Guy' },
];

export const MENU_ITEMS = [
    { id: 'item-1', name: 'Bagel with Cream Cheese', type: 'food' },
    { id: 'item-2', name: 'Scrambled Eggs', type: 'food' },
    { id: 'item-3', name: 'Croissant', type: 'food' },
    { id: 'item-4', name: 'Black Coffee', type: 'drink' },
    { id: 'item-5', name: 'Orange Juice', type: 'drink' },
];

export const INITIAL_ORDERS = [
    {
        id: 'ord-101',
        locationId: 'loc-1',
        date: '2025-01-05',
        items: { 'item-1': 5, 'item-4': 10 },
        status: 'completed',
        managerNotes: 'Extra cream cheese please',
    },
    {
        id: 'ord-102',
        locationId: 'loc-2',
        date: '2025-01-05',
        items: { 'item-2': 10, 'item-5': 5 },
        status: 'completed',
        managerNotes: '',
    }
];
