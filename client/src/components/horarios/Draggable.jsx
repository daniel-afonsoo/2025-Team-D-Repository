import { useDraggable } from "@dnd-kit/core";

function Draggable({ id, children, isBlocked, aulaInfo }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { aulaInfo },
    disabled: isBlocked,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab",
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