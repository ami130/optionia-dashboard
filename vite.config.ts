import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["jodit", "jodit-react"],
  },
  server: {
    port: 5173,
    host: true,
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ["@uiw/react-md-editor"],
//   },
//   server: {
//     port: 5173,
//     host: true,
//   },
// });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // server: {
//   //   port: 3000,
//   //   host: true,
//   // },
// });
