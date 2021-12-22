// import "./DAGCircle.css";
import { Point } from "types/graphs";
import { AddIcon, PencilIcon, TrashIcon } from '../Icons/index';
import { useCircleStyles } from './styles';



export interface AddProps {
  onEdit?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  loc: Point,
  size: number,
  backgroundColor?: string;
}
export const DAGCircle = ({
  loc: [x, y],
  size,
  onEdit,
  onAdd,
  onRemove,
  backgroundColor,
}: AddProps) => {
  const { classes } = useCircleStyles({
    size: size * 0.9,
    hasOnFunction: !!onEdit || !!onAdd,
    hasRemoveFunction: !!onRemove,
    backgroundColor,
  });
  return <>
    <foreignObject x={x} y={y} width={size} height={size}>
      <div className={classes.root}>
        {
          onEdit ?
            <PencilIcon
              size={70} units="%"
              className={classes.icon}
              onClick={onEdit}
            /> : onAdd ?
              <AddIcon
                size={70} units="%"
                className={classes.icon}
                onClick={onAdd}
              />
              : backgroundColor ? "" : "else"
        }
        {onRemove ? <TrashIcon className={classes.trashIcon} onClick={onRemove} /> : <></>}
      </div>
    </foreignObject>
  </>
}
