import { CellOptions } from "@/types/types";

interface Props {
  type: CellOptions;
}

const Cell: React.FC<Props> = ({ type }) => (
  <div className={`${type} cell w-8 rounded-lg xl:w-9`} />
);

export default Cell;
