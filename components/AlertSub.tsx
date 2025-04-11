"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const AlertSub = () => {
  const [show, setShow] = useState(true);
  return (
    <>
      <div
        className={`fixed top-0 w-full bg-primary-200 flex flex-row justify-between items-center px-6 ${
          show ? "" : "hidden"
        }`}
      >
        <p className="text-dark-200 text-sm font-semibold">
          Get unlimited voice based mock interviews with ai assitent with Pro
          subscription
        </p>
        <Button
          className="bg-transparent hover:bg-transparent text-dark-200 cursor-pointer font-bold"
          onClick={() => setShow(false)}
        >
          <X strokeWidth={3} className="font-bold" />
        </Button>
      </div>
    </>
  );
};

export default AlertSub;
