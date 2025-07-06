import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { HomeScreen } from "./screens/home.screen";
import { ActivityScreen } from "./screens/activity.screen";
import { CountersScreen } from "./screens/counters.screen";
import { DashboardScreen } from "./screens/dashboard.screen";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeScreen = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomeScreen />,
});

const activityScreen = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activities",
  shouldReload: true,
  component: () => <ActivityScreen />,
});

const dashboardScreen = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  shouldReload: true,
  component: () => <DashboardScreen />,
});

const countersScreen = createRoute({
  getParentRoute: () => rootRoute,
  path: "/counters",
  shouldReload: true,
  component: () => <CountersScreen />,
});

const routeTree = rootRoute.addChildren([
  homeScreen,
  dashboardScreen,
  activityScreen,
  countersScreen,
]);
export const router = createRouter({ routeTree });
