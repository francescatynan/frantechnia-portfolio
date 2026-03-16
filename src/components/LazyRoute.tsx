/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import type { ComponentType, FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

function Fallback() {
  const { t } = useTranslation("common");
  return (
    <div style={{ color: "var(--muted)" }}>
      {t("actions.loading")}
    </div>
  );
}

export function lazyRoute(
  importer: () => Promise<{ default: ComponentType }>
): FunctionComponent {
  const LazyComp = lazy(importer);

  return function LazyRouteWrapper() {
    return (
      <Suspense fallback={<Fallback />}>
        <LazyComp />
      </Suspense>
    );
  };
}
