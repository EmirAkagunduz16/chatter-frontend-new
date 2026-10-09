import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  server: {
    port: 3000,
    // Proxy configuration to match CRA's proxy setting
    proxy: {
      "^/(graphql|auth|users|chats|messages)(/|$)": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying for GraphQL subscriptions
      },
    },
    // Open browser automatically (like CRA)
    open: true,
  },
  build: {
    outDir: "build", // Match CRA's output directory
    sourcemap: true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "apollo-vendor": ["@apollo/client", "graphql", "graphql-ws"],
          "mui-vendor": [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
        },
      },
    },
  },
});
