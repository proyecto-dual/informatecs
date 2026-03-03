import React, { useState, useEffect } from "react";
import {
  FaChess,
  FaFlag,
  FaSkull,
  FaFlagCheckered,
  FaBasketballBall,
} from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";

const MascotCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  const mascots = [
    {
      src: "/imagenes/foondoo.gif",
      alt: "Mascota corriendo",
      icon: FaMedal,
      color: "#1b396a",
      label: "Deportes-Atletismo",
    },
    {
      src: "/imagenes/allbatroajedrez.gif",
      alt: "Mascota con ajedrez",
      icon: FaChess,
      color: "#1b396a",
      label: "Deportiva-Ajedrez",
    },
    {
      src: "/imagenes/albatrobanda.gif",
      alt: "Mascota con bandera mexicana",
      icon: FaFlag,
      color: " #1b396a",
      label: "Civica-Banda de guerra",
    },
    {
      src: "/imagenes/albatrocatrin.gif",
      alt: "Mascota día de muertos",
      icon: FaSkull,
      color: "#1b396a",
      label: "Cultural-Altar de muertos",
    },
    {
      src: "/imagenes/rally.gif",
      alt: "Albatro",
      icon: FaFlagCheckered,
      color: "#1b396a",
      label: "Civica-Rally",
    },
    {
      src: "/imagenes/basss.gif",
      alt: "Mascota con basketball",
      icon: FaBasketballBall,
      color: "#1b396a",
      label: "Deportes-Basquet",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleChange((currentIndex + 1) % mascots.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleChange = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setDisplayIndex(index);
      setCurrentIndex(index);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const currentMascot = mascots[displayIndex];

  return (
    <div className="carousel-container">
      <div className="icon-selector">
        {mascots.map((mascot, index) => {
          const IconComponent = mascot.icon;
          const isActive = currentIndex === index;
          return (
            <button
              key={index}
              className={`icon-btn ${isActive ? "active" : ""}`}
              onClick={() => handleChange(index)}
              disabled={isTransitioning}
              style={{
                "--color": mascot.color,
              }}
              title={mascot.label}
            >
              <IconComponent className="icon-symbol" />
              {isActive && <div className="pulse-effect"></div>}
            </button>
          );
        })}
      </div>

      <div className="image-wrapper">
        <img
          key={displayIndex}
          src={currentMascot.src}
          alt={currentMascot.alt}
          className={`mascot-img ${isTransitioning ? "fade-out" : "fade-in"}`}
        />
      </div>

      <div
        className="label-box"
        style={{
          "--color": mascots[currentIndex].color,
        }}
      >
        {mascots[currentIndex].label}
      </div>
    </div>
  );
};

export default MascotCarousel;
