const base = {
  primary: "#FF6320",
  primaryDark: "#D94D12",
  primarySoft: "#FFF0E9",
  white: "#FFFFFF",
  black: "#111318",
  success: "#19B26B",
  warning: "#F5A524",
  danger: "#E5484D",
};

export const lightTheme = {
  mode: "light",
  colors: {
    ...base,
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F6F6F8",
    surfaceRaised: "#FFFFFF",
    text: "#1B1E28",
    textMuted: "#7C838D",
    border: "#ECEEF2",
    icon: "#7C838D",
    cardShadow: "#B3BCC8",
    overlay: "rgba(17, 19, 24, 0.36)",
    bubbleMine: "#DFF2FF",
    bubbleOther: "#F4F5F7",
    input: "#F6F6F8",
  },
} as const;

export const darkTheme = {
  mode: "dark",
  colors: {
    ...base,
    background: "#111318",
    surface: "#171A21",
    surfaceMuted: "#20242E",
    surfaceRaised: "#1D212B",
    text: "#F7F8FA",
    textMuted: "#A7B0BC",
    border: "#2A303B",
    icon: "#B2BAC7",
    cardShadow: "#000000",
    overlay: "rgba(0, 0, 0, 0.46)",
    bubbleMine: "#18384D",
    bubbleOther: "#242933",
    input: "#20242E",
  },
} as const;

export type AppTheme = typeof lightTheme | typeof darkTheme;
