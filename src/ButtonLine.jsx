import React from "react";
import styles from "./ButtonLine.module.css";

const ButtonLine = ({ buttonText }) => {
  return (
    <div className={styles["button-container"]}>
      <button id="addLineButton">Добавить линию</button>
      <button id="hiddenLineButton">{buttonText}</button>
      <button id="deleteLineButton">Удалить все линии</button>
    </div>
  );
};

export default ButtonLine;
