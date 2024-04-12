import React from "react";
import styles from "./ButtonPoint.module.css";

const ButtonPoint = ({ buttonText }) => {
  return (
    <div className={styles["button-container"]}>
      <button id="addPointButton">Добавить точку</button>
      <button id="togglePointVisibilityButton">{buttonText}</button>
      <button id="deletePointButton">Удалить все точки</button>
    </div>
  );
};

export default ButtonPoint;
