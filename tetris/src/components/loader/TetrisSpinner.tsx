import React from "react";

const TetrisSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-12 h-12 animate-spin">
        <div className="grid grid-cols-2 gap-0.5">
          <div className="w-6 h-6 bg-orange-500 rounded-sm"></div>
          <div className="w-6 h-6"></div>
          <div className="w-6 h-6 bg-orange-500 rounded-sm"></div>
          <div className="w-6 h-6 bg-orange-500 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default TetrisSpinner;
