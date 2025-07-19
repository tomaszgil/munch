import { motion } from "motion/react";

interface AnimatedListItemProps {
  children: React.ReactNode;
}

export function AnimatedListItem({ children }: AnimatedListItemProps) {
  return (
    <motion.li
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: "auto",
        opacity: 1,
        transition: {
          type: "spring",
          bounce: 0.3,
          opacity: { delay: 0.1 },
        },
      }}
      exit={{
        height: 0,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.5,
        opacity: { duration: 0.1 },
      }}
      style={{
        overflow: "hidden",
      }}
    >
      {children}
    </motion.li>
  );
}
