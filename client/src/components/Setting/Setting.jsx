import React from "react";
import './setting.css'

const Setting = () => {
  return (
    <div className="settParent">
      <div className="personalDet">Personal Details</div>

      <div className="blockParentF">
        <div className="flexPF">
          <div className="flexPF1">Wallet Setting</div>
          <div className="flexPF1">Security</div>
        </div>
        <div className="flexPF">
          <div className="flexPF2">Theme</div>
          <div className="flexPF3">Other Icons</div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
