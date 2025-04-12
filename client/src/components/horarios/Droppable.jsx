import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, children, isBlocked }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    backgroundColor: isOver && !isBlocked ? "lightblue" : undefined,
  };

  return (
    <td ref={setNodeRef} style={style} className="empty-slot">
      {children}
    </td>
  );
}

export default Droppable;
// O componente Droppable é responsável por tornar uma área da interface do usuário receptiva a elementos arrastáveis.