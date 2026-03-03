"use client";
import React from "react";
import { motion } from "framer-motion";

const SplitText = ({
  text = "",
  className = "",
  delay = 50,
  animationFrom = { opacity: 0, y: 20 },
  animationTo = { opacity: 1, y: 0 },
  easing = [0.33, 1, 0.68, 1], // Valor por defecto corregido (Bezier para easeOutCubic)
}) => {
  const words = text.split(" ").filter(Boolean);

  // Función para validar que el easing sea compatible con Framer Motion
  const getSafeEasing = (val) => {
    if (val === "easeOutCubic") return [0.33, 1, 0.68, 1];
    return val;
  };

  return (
    <span className={className} style={{ display: "inline-block" }}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            marginRight: wordIndex === words.length - 1 ? "0" : "0.25em",
          }}
        >
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={animationFrom}
              whileInView={animationTo}
              viewport={{ once: true }}
              transition={{
                delay: (wordIndex * 0.1) + (charIndex * (delay / 1000)),
                duration: 0.5,
                ease: getSafeEasing(easing), // Aplicamos la validación aquí
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default SplitText;