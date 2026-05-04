import React from "react";

function Button({ name }) {
  return (
    <button
      className="w-full bg-[#144DEF] p-2 rounded-full text-white text-lg font-bold hover:bg-transparent hover:border-2 hover:border-[#144DEF] 
          hover:text-[#144def] active:bg-[#144DEF]/80 active:text-white cursor-pointer  transition-all duration-300 ease-in-out"
      type="submit"
    >
      {name}
    </button>
  );
}

export default Button;
