export const MENU_KEYS = {
    categories: () => ['categories'],
    menus: (restaurantId?: string) => ['menus', restaurantId],
}

export const USER_KEYS = {
    logo: () => ['logo']
}

export const TABLE_KEYS = {
    table: () => ['table'],
    layout: () => ['table', 'layout']
}

export const SP_KEYS = {
    courts: () => ['courts'],
    restaurantsCommission: () => ['restaurantsCommission']
}

export const ORDER_KEYS = {
    orders: (params?: { restaurantId?: string; tableNumber?: number }) => ['orders', params]
}

export const PAYMENT_KEYS = {
    details: () => ['paymentDetails']
}