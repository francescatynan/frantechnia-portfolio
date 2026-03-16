import { RootRoute, Route } from "@tanstack/react-router";
import RootLayout from "./routes/__root";
import HomePage from "./routes/index";
import ProjectsPage from "./routes/projects";
import { lazyRoute } from "./components/LazyRoute";
import BlogPage from "./routes/blog";
import BlogPostPage from "./routes/blog.$slug";

const ProjectDetailPage = lazyRoute(() => import("./routes/projects.$slug"));

const rootRoute = new RootRoute({
  component: RootLayout,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const projectsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectsPage,
});

const projectDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug",
  component: ProjectDetailPage,
});

const blogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});

const blogPostRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/blog/$slug",
  component: BlogPostPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  projectsRoute,
  projectDetailRoute,
  blogRoute,
  blogPostRoute,
]);
