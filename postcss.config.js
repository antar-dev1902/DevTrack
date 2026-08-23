// This project doesn't use any PostCSS plugins (no Tailwind, no autoprefixer
// config, etc.) — plain CSS with custom properties is all it needs. This
// file exists purely so Vite's postcss-load-config search stops HERE,
// at the project root, instead of walking further up the directory tree
// (Desktop / OneDrive) and finding some other, broken postcss config
// (that's what caused the "Unexpected end of JSON input" error — an empty
// or malformed config file outside this project, not anything in it).
export default {
  plugins: {},
};
