# Functional Specification: Food Menu

## 1. Overview
The Food Menu screen enables employees to browse and order meals and snacks. It replaces the basic ordering page with a high-fidelity, categorized, responsive bento-grid layout.

## 2. Features
- **Categorization**: Items are organized into sections: Breakfast, Lunch Specials, and Snacks & Drinks.
- **Bento-Grid Layout**: Dynamic grid sizing for featured items (e.g., Chef's Specials taking up 2 columns on desktop).
- **Out of Stock State**: Unavailable items are displayed in grayscale with a disabled action button.
- **Dietary Tags**: Badges for "Gluten Free", "kcal", etc., are supported.
- **Float Cart Action**: A persistent floating button showing the total cart value, adapting between mobile (bottom center) and desktop (bottom right).
- **Real-Time Feedback**: Adding an item briefly changes the button state to "Added" with a checkmark before reverting.

## 3. Roles and Access
- Available to all `employee` roles via the "Food" navigation link.

## 4. Dependencies
- Reads from `MenuItem` catalog (mocked or from an API).
- Submits to `useOrderStore` to create a `FoodOrder`.

## 5. Billing & Consumption Tracking
- **Internal System**: The system is for internal tracking only. There is no actual payment gateway or real-world billing during the checkout process. Prices are meant to represent internal costs.
- **Purpose**: The primary goal is to track inventory levels and monitor beverage and food consumption (and associated internal costs) per employee.
- **Employee View**: A new page will be added to the Employee Portal (`/employee/consumption`) to allow individuals to track their personal consumption and cost history.
- **HR View**: A new page will be added to the HR Portal (`/hr/consumption`) to monitor company-wide consumption trends and track individual employee costs.
