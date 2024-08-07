import React, { useState, useContext } from "react";
import { UserContext } from "../../UserContext";

const SalaryBox = ({ closePopup }) => {
  const { user, setUser } = useContext(UserContext);
  const [newSalary, setNewSalary] = useState(user.salary);

  const updateNewSalary = () => {
    setUser({ ...user, salary: Number(newSalary) });
    closePopup();
  };

  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="topBuy">
          <h2>Edit Salary</h2>
          <i id="closeP" onClick={closePopup} className="fa-solid fa-xmark"></i>
        </div>
        <input
          value={newSalary}
          onChange={(e) => {
            setNewSalary(e.target.value);
          }}
          type="number"
          placeholder="Enter Monthly Salary"
          className="inputStock"
        />
        <button onClick={updateNewSalary} className="buy-button">
          Edit Salary
        </button>
      </div>
    </div>
  );
};

export default SalaryBox;
