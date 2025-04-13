"use client"

import type { Variants } from "framer-motion"

// ===== MODAL ANIMATIONS =====
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const modalTransition = {
  duration: 0.2,
  ease: "easeInOut",
}

// ===== TAB ANIMATIONS =====
export const tabVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
}

export const tabTransition = {
  duration: 0.2,
  ease: "easeOut",
}

// ===== EXPANDABLE ROW ANIMATIONS =====
export const expandableRowVariants: Variants = {
  hidden: { height: 0, opacity: 0, overflow: "hidden" },
  visible: { height: "auto", opacity: 1, overflow: "visible" },
  exit: { height: 0, opacity: 0, overflow: "hidden" },
}

export const expandableRowTransition = {
  duration: 0.25,
  ease: "easeInOut",
}

// ===== TOAST ANIMATIONS =====
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const toastTransition = {
  duration: 0.2,
  ease: "easeOut",
}

// ===== LIST ITEM ANIMATIONS =====
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom) => ({
    opacity: 1,
    x: 0,
    transition: { delay: custom * 0.05 },
  }),
  exit: { opacity: 0, x: -10 },
}

export const listItemTransition = {
  duration: 0.15,
  ease: "easeOut",
}

// ===== PAGE TRANSITION ANIMATIONS =====
export const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const pageTransition = {
  duration: 0.3,
  ease: "easeInOut",
}

// ===== HOVER ANIMATIONS =====
export const buttonHoverVariants = {
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
}

export const cardHoverVariants = {
  hover: { y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" },
  tap: { y: -2 },
}

export const iconHoverVariants = {
  hover: { scale: 1.1, rotate: 5 },
  tap: { scale: 0.9 },
}

// ===== COMBINED PROPS FOR EASY USE =====
export const fadeIn = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  transition: { duration: 0.2 },
}

export const slideUp = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  transition: { duration: 0.3 },
}

export const slideIn = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  transition: { duration: 0.3 },
}

// ===== STAGGERED CHILDREN ANIMATIONS =====
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

// ===== UTILITY FUNCTIONS =====
export const getStaggeredDelay = (index: number, baseDelay = 0.05) => ({
  transition: { delay: index * baseDelay },
})
