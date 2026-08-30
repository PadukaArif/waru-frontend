import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WARU — Warung POS & Analytics",
    short_name: "WARU",
    description: "WARU - Multi-Outlet & POS Management System",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#293855",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
