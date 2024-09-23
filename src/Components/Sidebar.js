import React from "react";

const Sidebar = ({ sidebarWidth, setSidebarWidth }) => {
  const resizeBar = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e) => {
      setSidebarWidth(startWidth + (e.clientX - startX));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="relative bg-gray-800 text-white p-4"
      style={{ width: `${sidebarWidth}px` }}
    >
      <p>Sidebar Content</p>
      <ul>
        <li>HOME</li>
        <li>ABOUT</li>
        <li>CONTENT</li>
      </ul>
      <div
        className="absolute top-0 right-0 h-full w-1 bg-black-600 cursor-ew-resize"
        onMouseDown={resizeBar}
      />
    </div>
  );
};

export default Sidebar;
