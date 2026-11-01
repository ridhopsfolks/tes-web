/// <reference types="vite/client" />

declare module "*?raw" {
  const content: string;
  export default content;
}

declare module "*?inline" {
  const src: string;
  export default src;
}
