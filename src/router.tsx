import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Create the router instance
export const router = createRouter({ routeTree });

// Register router type for TS inference
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
