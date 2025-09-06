// Minimal ambient declaration to satisfy TypeScript for BASE_URL in seeds.
interface ImportMetaEnv {
  readonly BASE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
