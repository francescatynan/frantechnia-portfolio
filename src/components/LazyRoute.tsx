/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

function Fallback() {
  const { t } = useTranslation("common");
  return (
    <div style={{ color: "var(--muted)" }}>
      {t("actions.loading")}
    </div>
  );
}

export function lazyRoute<P extends Record<string, unknown>>(
  importer: () => Promise<{ default: ComponentType<P> }>
): ComponentType<P> {
  const LazyComp = lazy(importer);

  return function LazyRouteWrapper(props: P) {
    return (
      <Suspense fallback={<Fallback />}>
        <LazyComp {...props} />
      </Suspense>
    );
  };
}
