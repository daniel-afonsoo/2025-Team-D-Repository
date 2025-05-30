import { useDroppable } from "@dnd-kit/core"; 

// Droppable cell
function Droppable({ id, children, isBlocked }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    backgroundColor: isOver && !isBlocked ? "lightblue" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="empty-slot">
      {children}
    </div>
  );
}

export default Droppable;