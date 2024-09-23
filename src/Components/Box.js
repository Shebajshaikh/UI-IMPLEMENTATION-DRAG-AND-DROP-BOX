import React from "react";

const Box = ({ box, index, dragStart, boxDrop, gridWidth, setBoxes }) => {
  const boxStyle = {
    width: `${box.width}px`,
    height: "100px",
    background: "black",
    color: "white",
    gridColumnEnd: `span ${Math.ceil(box.width / gridWidth)}`,
    position: "relative",
    transition: "width 0.1s ease-in-out",
  };

  const handleResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = box.width;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX; 

      let newWidth;
      if (direction === "right") {
        newWidth = Math.max(startWidth + deltaX, gridWidth);
      } else if (direction === "left") {
        newWidth = Math.max(startWidth + deltaX, gridWidth);
      }

      setBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        newBoxes[index] = { ...newBoxes[index], width: newWidth };
        return newBoxes;
      });
      
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      setBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        const snappedWidth = Math.round(newBoxes[index].width / gridWidth) * gridWidth;
        newBoxes[index] = { ...newBoxes[index], width: snappedWidth };
        return newBoxes;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="text-white flex items-center justify-center cursor-pointer"
      draggable
      onDragStart={(e) => dragStart(e, index)}
      onDrop={(e) => boxDrop(e, index)}
      onDragOver={(e) => e.preventDefault()}
      style={boxStyle}
    >
      {box.id}
      <div
        className="absolute left-0 top-0 h-full w-2 bg-black-600 cursor-ew-resize"
        onMouseDown={(e) => handleResize(e, "left")}
      />
      <div
        className="absolute right-0 top-0 h-full w-2 bg-blac-600 cursor-ew-resize"
        onMouseDown={(e) => handleResize(e, "right")}
      />
    </div>
  );
};

export default Box;
