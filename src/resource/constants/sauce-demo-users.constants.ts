// Publicly documented demo accounts for https://www.saucedemo.com/ (KT/testing purposes only).
export const SauceDemoUsers = {
    standard: { username: "standard_user", password: "secret_sauce" },
    lockedOut: { username: "locked_out_user", password: "secret_sauce" },
    problem: { username: "problem_user", password: "secret_sauce" },
    performanceGlitch: { username: "performance_glitch_user", password: "secret_sauce" },
    errorUser: { username: "error_user", password: "secret_sauce" },
    visual: { username: "visual_user", password: "secret_sauce" }
} as const;
