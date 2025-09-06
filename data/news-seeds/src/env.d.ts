// Ambient declarations for data/news-seeds package
// This package is built with plain tsc (no Vite transform), so we provide
// a minimal ImportMetaEnv shape for compile-time only. The runtime bundler
// (app) will supply actual values; data files should remain runtime-agnostic.
interface ImportMetaEnv {
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
