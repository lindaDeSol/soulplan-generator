import React from "react";

interface ArrowProps {
  isOpen: boolean;
}

const AccordeonArrow: React.FC<ArrowProps> = ({ isOpen }) => {
  return (
    <span className="font-serif text-gray-500 text-l rotate-90 transform scale-y-150 cursor-pointer">
      {isOpen ? "<" : ">"}
    </span>
  );
};

export default AccordeonArrow;
