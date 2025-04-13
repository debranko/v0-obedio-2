// Theme configuration for the Obedio Admin App
// This file centralizes design tokens and patterns for consistent UI/UX

export const themeConfig = {
  // Color palette
  colors: {
    primary: {
      main: "bg-blue-600",
      hover: "hover:bg-blue-700",
      text: "text-blue-600",
      light: "bg-blue-50",
      border: "border-blue-200",
    },
    success: {
      main: "bg-green-600",
      hover: "hover:bg-green-700",
      text: "text-green-600",
      light: "bg-green-50",
      border: "border-green-200",
    },
    error: {
      main: "bg-red-600",
      hover: "hover:bg-red-700",
      text: "text-red-600",
      light: "bg-red-50",
      border: "border-red-200",
    },
    warning: {
      main: "bg-amber-600",
      hover: "hover:bg-amber-700",
      text: "text-amber-600",
      light: "bg-amber-50",
      border: "border-amber-200",
    },
    neutral: {
      main: "bg-slate-600",
      hover: "hover:bg-slate-700",
      text: "text-slate-600",
      light: "bg-slate-50",
      border: "border-slate-200",
    },
    background: {
      main: "bg-white",
      muted: "bg-muted/30",
    },
  },

  // Typography
  typography: {
    title: "text-2xl font-bold tracking-tight",
    subtitle: "text-lg font-medium",
    body: "text-base",
    small: "text-sm",
    tiny: "text-xs",
  },

  // Spacing
  spacing: {
    section: "space-y-6",
    container: "space-y-4",
    item: "space-y-2",
    grid: "gap-6",
    gridItem: "gap-4",
  },

  // Component styling
  components: {
    card: {
      container: "bg-white rounded-2xl shadow-md border",
      header: "p-6 pb-2",
      content: "p-6 pt-2",
      footer: "p-6 pt-0 flex justify-end space-x-2",
    },
    badge: {
      online: "bg-green-50 text-green-700 border-green-200",
      offline: "bg-red-50 text-red-700 border-red-200",
      warning: "bg-amber-50 text-amber-700 border-amber-200",
      neutral: "bg-slate-100 text-slate-700 border-slate-200",
    },
    table: {
      container: "w-full rounded-xl border overflow-hidden",
      header: "bg-muted/10",
      row: "hover:bg-muted/20 transition-colors",
      cell: "p-4",
    },
    button: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      icon: "h-4 w-4",
    },
    input: {
      container: "space-y-2",
      label: "font-medium text-sm",
      field: "rounded-md border border-slate-200",
    },
  },

  // Animation presets (for framer-motion)
  animations: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },
    slideIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: "easeOut" },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 },
    },
    buttonHover: {
      whileHover: { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
      transition: { duration: 0.2 },
    },
  },
}
