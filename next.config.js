/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
  ...withPWAInit({
    dest: "public",
    register: true,
  }),
};

export default config;
