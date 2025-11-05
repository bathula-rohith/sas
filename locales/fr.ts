export const fr = {
    sidebar: {
        dashboard: 'Dashboard',
        commonSettings: 'Common Settings',
        security: 'Security',
        fileSystem: 'File System',
        channelConfiguration: 'Channel Configuration',
        settings: {
            branding: 'Branding',
            general: 'General',
            security: 'Security',
            notifications: 'Notifications',
            integrations: 'Integrations',
        },
        security_items: {
            users: 'Users',
            roles: 'Roles & Permissions',
            audit: 'Audit Logs',
        },
    },
    header: {
        // ... (placeholders)
        toggleTheme: 'Toggle Theme',
        userAvatarAlt: 'User Avatar',
        profile: 'My Profile',
        logout: 'Logout',
        notifications: {
            title: 'Notifications',
            userRegistered: 'New user registered: {{name}}',
            reportReady: 'Your weekly report is ready for download.',
            maintenance: 'System maintenance scheduled for tomorrow.',
            viewAll: 'View all notifications',
        }
    },
    login: {
        // ... (placeholders)
        title: 'Sign in to your account',
        emailPlaceholder: 'Email address',
        passwordPlaceholder: 'Password',
        forgotPassword: 'Forgot your password?',
        signIn: 'Sign In',
        signingIn: 'Signing In...',
        noAccount: "Don't have an account?",
        registerHere: 'Register here',
    },
    dashboard: {
        // ... (placeholders)
        welcome: 'Welcome back, {{name}}!',
        summary: "Here's a summary of your workspace.",
        cards: {
            totalUsers: 'Total Users',
            usersChange: '-2 this month',
            filesStored: 'Files Stored',
            storageUsed: 'Storage Used',
            activeRole: 'Active Role',
        },
        charts: {
            revenueSummary: 'Revenue Summary',
            revenue: 'Revenue',
            userActivity: 'Weekly User Activity',
            logins: 'Logins',
            uploads: 'Uploads',
        },
        actions: {
            title: 'Quick Actions',
            addUser: 'Add New User',
            uploadFile: 'Upload a File',
            generateReport: 'Generate Report',
        },
        activity: {
            title: 'Recent Activity',
            uploaded: 'uploaded {{file}}',
            updatedProfile: 'updated their profile',
            deletedAccount: 'deleted a user account',
            loggedIn: 'logged in',
        }
    },
    settings: {
        tabs: {
            branding: 'Branding',
            general: 'General',
            security: 'Security',
            notifications: 'Notifications',
            integrations: 'Integrations',
        },
        // ... (placeholders)
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        resetToDefaults: 'Reset to defaults',
        confirmReset: 'Are you sure you want to reset all settings to their default values?',
        branding: {
            title: 'Branding',
            appName: 'Application Name',
            logo: 'Logo',
            uploadLogo: 'Upload Logo',
            themeColors: 'Theme Colors',
            primary: 'Primary Color',
            primaryDesc: 'Used for main buttons, links, and highlights.',
            secondary: 'Secondary Color',
            secondaryDesc: 'Used for secondary elements and accents.',
        },
        whitelabel: {
            customDomain: 'Custom Domain',
            favicon: 'Favicon',
            uploadFavicon: 'Upload Favicon',
            emailTitle: 'Email Templates',
            emailDesc: 'Customize the header and footer of emails sent from the application.',
            emailHeader: 'Email Header Text',
            emailFooter: 'Email Footer Text',
        },
        general: {
            title: 'General Settings',
            timezone: 'Timezone',
            language: 'Language',
        },
        security: {
            title: 'Security',
            sessionTimeout: 'Session Timeout (in minutes)',
            enforce2FA: 'Enforce Two-Factor Authentication',
            enforce2FADesc: 'Require all users to set up 2FA.',
        },
        // FIX: Merged duplicate `notifications` properties into a single object.
        notifications: {
            saved: 'Settings saved successfully!',
            reset: 'Settings have been reset to default.',
            '2faEnabled': 'Two-Factor Authentication has been enabled.',
            title: 'Notification Preferences',
            weeklySummary: 'Weekly Summary Emails',
            weeklySummaryDesc: 'Receive a summary of workspace activity every week.',
            productUpdates: 'Product & Feature Updates',
            productUpdatesDesc: 'Receive news about new features and improvements.',
        },
        integrations: {
            title: 'Integrations',
            description: 'Connect your favorite third-party apps and services.',
            gdriveDesc: 'Sync and backup files to Google Drive.',
            dropboxDesc: 'Connect your Dropbox account for file synchronization.',
            slackDesc: 'Receive notifications and alerts in your Slack channels.',
            connected: 'Connected',
            connect: 'Connect',
            wizard: {
                title: 'Cloud Storage Integration Setup',
                step: 'Step {{current}} of {{total}}',
                back: 'Back',
                next: 'Next',
                finish: 'Finish & Save',
                successNotification: 'Integration connected successfully!',
                step1: {
                    title: 'Choose a provider',
                    desc: 'Select a cloud storage service to connect.',
                },
                step2: {
                    title: 'Authenticate with {{provider}}',
                    desc: 'You will be redirected to authenticate your account.',
                    button: 'Authenticate',
                },
                step3: {
                    title: 'Configure Settings',
                    desc: 'Set up your preferences for this integration.',
                    folderLabel: 'Backup Folder Name',
                    syncLabel: 'Sync Frequency',
                    syncRealtime: 'Real-time',
                    syncDaily: 'Daily',
                    syncWeekly: 'Weekly',
                },
                step4: {
                    title: 'Review and Finish',
                    desc: 'Please review your configuration before finishing the setup.',
                    provider: 'Provider',
                    folder: 'Folder Name',
                    sync: 'Sync Frequency',
                }
            }
        },
    },
    channelConfiguration: {
        title: 'Channel Configuration Wizard',
        description: 'Set up communication channels to connect with your users.',
        step: 'Step {{current}} of {{total}}',
        back: 'Back',
        next: 'Next',
        finish: 'Finish & Save',
        successNotification: 'Channel configured successfully!',
        step1: {
            title: 'Select Channels',
            description: 'Choose one or more channels to configure.',
            chat: 'Chat Widget',
            whatsapp: 'WhatsApp',
        },
        step2: {
            title: 'Configure Channels',
            brandingTitle: 'Chat Widget Branding',
            headerText: 'Header Text',
            widgetColor: 'Widget Color',
            whatsappTitle: 'WhatsApp Configuration',
            phoneNumber: 'WhatsApp Phone Number',
            apiToken: 'API Token',
        },
        step3: {
            title: 'Connect Flow',
            description: 'Connect a conversational flow to power your channels.',
            apiKey: 'Flow API Key',
            getFlows: 'Get Flows',
            gettingFlows: 'Getting...',
            flowName: 'Flow Name',
            selectFlow: 'Select a flow...',
        },
        step4: {
            title: 'Preview & Finish',
            description: 'Review your channel previews before saving.',
            chatPreviewTitle: 'Chat Widget Preview',
            whatsappPreviewTitle: 'WhatsApp Preview',
        }
    },
    time: {
        // ... (placeholders)
        minutesAgo: '{{count}} minutes ago',
        hoursAgo: '{{count}} hours ago',
        daysAgo: '{{count}} days ago',
    }
};
