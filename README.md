# Colloki - Multi-Tenant SaaS Platform v2.4.0

Colloki is a comprehensive, multi-tenant SaaS application designed for enterprise collaboration and management. It provides a secure, customizable, and feature-rich environment for businesses to manage users, roles, files, and system settings.

## Main Features

-   **Multi-Tenant Architecture**: Securely isolated environments for each tenant.
-   **Authentication**: Robust login, registration, and password management flows.
-   **Dashboard**: An at-a-glance overview of key metrics, user activity, and quick actions.
-   **RBAC (Role-Based Access Control)**:
    -   **User Management**: Invite, view, edit, and delete users.
    -   **Role Management**: Define roles with granular permissions.
    -   **Audit Logs**: Track user actions for security and compliance.
-   **File System**: A secure place to manage and preview tenant-specific files.
-   **Whitelabeling & Customization (Common Settings)**:
    -   **Theming**: Customize primary/secondary colors and toggle between light/dark modes.
    -   **Branding**: Set a custom app name, logo, favicon, and custom domain.
    -   **Localization**: Full internationalization (i18n) support with dynamic language switching (EN, HI, TE, ES, FR, DE).
    -   **SaaS Configuration**: Set timezone, session timeout, and enforce 2FA.
    -   **Email Customization**: Modify email headers and footers for tenant-specific branding.
    -   **Integrations**: Connect to third-party services via a multi-step setup wizard.
-   **Notifications**:
    -   A functional notifications popover in the header.
    -   A global notification system for user feedback on actions (e.g., saving settings).
-   **Responsive Design**: A clean, modern UI that works across devices.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **State Management**: Zustand
-   **Routing**: React Router
-   **Forms**: React Hook Form
-   **Charting**: Recharts

## Project Structure

```
/
├── public/
├── src/
│   ├── components/      # Reusable UI components (Sidebar, Header, Modals, etc.)
│   ├── constants.tsx      # App-wide constants (navigation items, icons)
│   ├── context/         # React context providers (e.g., TranslationContext)
│   ├── hooks/           # Custom hooks (useAuth, useRbac)
│   ├── layouts/         # Layout components (AppLayout, AuthLayout)
│   ├── locales/         # i18n translation files (en, hi, te, etc.)
│   ├── pages/           # Page components for each route
│   │   ├── security/    # Sub-pages for the security section
│   │   └── ...
│   ├── services/        # Mock API service functions
│   ├── store/           # Zustand global state stores (auth, settings)
│   ├── types.ts         # TypeScript type definitions
│   └── App.tsx          # Main application component with routing
└── index.html           # Main HTML file
```

## Version History

-   **v2.4.0 (Current)**: Refined sidebar UI with a more spacious, composite layout.
-   **v2.3.0**: Redesigned main sidebar with a collapsible "Common Settings" menu for consistent navigation.
-   **v2.2.0**: Redesigned Settings page with a tabbed layout and added a multi-step integration wizard.
-   **v2.1.0**: Enhanced Common Settings for true SaaS whitelabeling, functional Quick Actions, and a simulated 2FA setup modal.
-   **v2.0.0**: Implemented full internationalization (i18n) and improved UX in Common Settings.
-   **v1.9.0**: Expanded Common Settings with realistic SaaS features (timezone, 2FA, notifications).
-   **v1.8.0**: Removed the global search bar from the header for a cleaner UI.
-   **v1.7.0**: Added file preview modal in the File System.
-   **v1.6.0**: Added notifications popover and editable app name.
-   **v1.5.0**: Reordered sidebar navigation for better usability.
-   **v1.4.0**: Balanced UI compactness for improved readability.
-   **v1.3.0**: Refined UI with smaller fonts and icons for a cleaner look.
-   **v1.2.0**: Made UI more compact with smaller icons and fonts.
-   **v1.1.0**: Implemented a more compact UI design.
-   **v1.0.0**: Initial modern UI/UX overhaul with dashboard widgets.