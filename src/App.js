import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import Box from "./Components/Box";
import Header from "./Components/Header";
import "./App.css";

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [boxes, setBoxes] = useState([
    { id: "A", width: 400 },
    { id: "B", width: 400 },
    { id: "C", width: 400 },
    { id: "D", width: 400 },
    { id: "E", width: 400 },
    { id: "F", width: 400 },
    { id: "G", width: 400 },
    { id: "H", width: 400 },
    { id: "I", width: 400 },
  ]);
  const [gridWidth, setGridWidth] = useState(100);
  const [columns, setColumns] = useState(3);

  const updateGridWidth = () => {
    const totalWidth = window.innerWidth - sidebarWidth;
    setGridWidth(totalWidth / columns );
  };

  const updateColumns = () => {
    if (window.innerWidth - sidebarWidth > 1200) {
      setColumns(3);
    } else if (window.innerWidth - sidebarWidth > 800) {
      setColumns(2);
    } else {
      setColumns(1);
    }
  };

  useEffect(() => {
    updateGridWidth();
    updateColumns();

    const handleResize = () => {
      updateGridWidth();
      updateColumns();
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarWidth]);

  const dragStart = (e, index) => {
    e.dataTransfer.setData("dragIndex", index);
  };

  const boxDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData("dragIndex");

    if (dragIndex !== dropIndex.toString()) {
      const newBoxes = [...boxes];
      const [dragBox] = newBoxes.splice(dragIndex, 1);
      newBoxes.splice(dropIndex, 0, dragBox);
      setBoxes(newBoxes);
    }
  };

  const resizeStart = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = boxes[index].width;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(startWidth + (e.clientX - startX), gridWidth);
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

  const getGridStyle = () => ({
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridAutoFlow: "row",
  });

  return (
    <div className="flex h-screen">
      <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />

      <div className="flex-1 p-4">
        <Header />

        <div
          className="grid gap-4"
          style={getGridStyle()}
          onDrop={(e) => boxDrop(e, Math.floor(e.clientX / gridWidth))}
          onDragOver={(e) => e.preventDefault()}
        >
          {boxes.map((box, index) => (
            <Box
              key={box.id}
              box={box}
              index={index}
              dragStart={dragStart}
              boxDrop={boxDrop}
              resizeStart={resizeStart}
              gridWidth={gridWidth}
              setBoxes={setBoxes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
