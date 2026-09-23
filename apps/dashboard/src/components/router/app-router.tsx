"use client";

import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { RouteSkeleton } from "@/components/route-skeleton";
import { type RouteConfig, routes } from "@/config/routes";

function renderRoutes(routeConfigs: RouteConfig[]) {
  return routeConfigs.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Suspense fallback={<RouteSkeleton />}>{route.element}</Suspense>
      }
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
}

export function AppRouter() {
  return <Routes>{renderRoutes(routes)}</Routes>;
}
