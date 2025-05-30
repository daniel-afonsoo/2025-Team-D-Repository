import React from "react";
import { useDraggable } from "@dnd-kit/core"; 

// Draggable class box
function Draggable({ id, children, isBlocked, aulaInfo, durationBlocks }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { aulaInfo },
    disabled: isBlocked,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: isBlocked ? "not-allowed" : "grab",
    height: "100%", // Ensure the draggable spans the full height of the cell
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="aula"
    >
      {children}
    </div>
  );
}

export default Draggable;