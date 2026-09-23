/* eslint-disable react-refresh/only-export-components -- route table module: route data plus lazy elements, not a refreshable component */
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Lazy load components for better performance
const Dashboard = lazy(() => import('@/app/overview/page'))
const Dashboard2 = lazy(() => import('@/app/analytics/page'))
const Tasks = lazy(() => import('@/app/tasks/page'))
const Chat = lazy(() => import('@/app/chat/page'))
const Calendar = lazy(() => import('@/app/calendar/page'))
const Users = lazy(() => import('@/app/users/page'))
const FAQs = lazy(() => import('@/app/faqs/page'))
const Pricing = lazy(() => import('@/app/pricing/page'))

// Auth pages
const SignIn = lazy(() => import('@/app/auth/sign-in/page'))
const SignUp = lazy(() => import('@/app/auth/sign-up/page'))
const ForgotPassword = lazy(() => import('@/app/auth/forgot-password/page'))

// Error pages
const Unauthorized = lazy(() => import('@/app/errors/unauthorized/page'))
const Forbidden = lazy(() => import('@/app/errors/forbidden/page'))
const NotFound = lazy(() => import('@/app/errors/not-found/page'))
const InternalServerError = lazy(() => import('@/app/errors/internal-server-error/page'))
const UnderMaintenance = lazy(() => import('@/app/errors/under-maintenance/page'))

// Settings pages
const UserSettings = lazy(() => import('@/app/settings/user/page'))
const AccountSettings = lazy(() => import('@/app/settings/account/page'))
const BillingSettings = lazy(() => import('@/app/settings/billing/page'))
const AppearanceSettings = lazy(() => import('@/app/settings/appearance/page'))
const NotificationSettings = lazy(() => import('@/app/settings/notifications/page'))
const ConnectionSettings = lazy(() => import('@/app/settings/connections/page'))

export interface RouteConfig {
  path: string
  element: React.ReactNode
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  // Default route - redirect to overview
  // Use relative path "overview" instead of "/overview" for basename compatibility
  {
    path: "/",
    element: <Navigate to="overview" replace />
  },

  // Overview Routes
  {
    path: "/overview",
    element: <Dashboard />
  },
  {
    path: "/analytics",
    element: <Dashboard2 />
  },

  // Application Routes
  {
    path: "/tasks",
    element: <Tasks />
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/calendar",
    element: <Calendar />
  },

  // Content Pages
  {
    path: "/users",
    element: <Users />
  },
  {
    path: "/faqs",
    element: <FAQs />
  },
  {
    path: "/pricing",
    element: <Pricing />
  },

  // Authentication Routes
  {
    path: "/auth/sign-in",
    element: <SignIn />
  },
  {
    path: "/auth/sign-up",
    element: <SignUp />
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />
  },

  // Error Pages
  {
    path: "/errors/unauthorized",
    element: <Unauthorized />
  },
  {
    path: "/errors/forbidden",
    element: <Forbidden />
  },
  {
    path: "/errors/not-found",
    element: <NotFound />
  },
  {
    path: "/errors/internal-server-error",
    element: <InternalServerError />
  },
  {
    path: "/errors/under-maintenance",
    element: <UnderMaintenance />
  },

  // Settings Routes
  {
    path: "/settings/user",
    element: <UserSettings />
  },
  {
    path: "/settings/account",
    element: <AccountSettings />
  },
  {
    path: "/settings/billing",
    element: <BillingSettings />
  },
  {
    path: "/settings/appearance",
    element: <AppearanceSettings />
  },
  {
    path: "/settings/notifications",
    element: <NotificationSettings />
  },
  {
    path: "/settings/connections",
    element: <ConnectionSettings />
  },

  // Catch-all route for 404
  {
    path: "*",
    element: <NotFound />
  }
]
