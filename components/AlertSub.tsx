"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const AlertSub = () => {
  const [show, setShow] = useState(true);
  return (
    <>
      <div
        className={`bg-primary-200 flex flex-row justify-between items-center md:px-6 px-2 ${
          show ? "" : "hidden"
        }`}
      >
        <p className="text-dark-200 text-sm font-semibold md:block hidden">
          Get unlimited voice based mock interviews with ai assitent with Pro
          subscription
        </p>
        <p className="text-dark-200 text-sm font-semibold block md:hidden">
          Get unlimited voice interviews with Pro
        </p>
        <Button
          className="bg-transparent hover:bg-transparent text-dark-200 cursor-pointer font-bold"
          onClick={() => setShow(false)}
        >
          <X strokeWidth={3} />
        </Button>
      </div>
    </>
  );
};

export default AlertSub;
