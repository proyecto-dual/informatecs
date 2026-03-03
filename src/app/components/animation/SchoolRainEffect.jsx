import React from "react";
import {
  FaFootballBall,
  FaBasketballBall,
  FaMusic,
  FaPaintBrush,
  FaTheaterMasks,
  FaBook,
  FaPencilAlt,
  FaGraduationCap,
  FaFlask,
  FaMicroscope,
  FaChartBar,
  FaLightbulb,
  FaBrain,
  FaLaptopCode,
  FaCode,
  FaDatabase,
} from "react-icons/fa";

const SchoolRainEffect = () => {
  const icons = [
    FaFootballBall,
    FaBasketballBall,
    FaMusic,
    FaPaintBrush,
    FaTheaterMasks,
    FaBook,
    FaPencilAlt,
    FaGraduationCap,
    FaFlask,
    FaMicroscope,
    FaChartBar,
    FaLightbulb,
    FaBrain,
    FaLaptopCode,
    FaCode,
    FaDatabase,
  ];

  return (
    <div className="school-rain">
      {icons.map((Icon, i) => (
        <div key={i} className="rain-item">
          <Icon />
        </div>
      ))}
    </div>
  );
};

export default SchoolRainEffect;
