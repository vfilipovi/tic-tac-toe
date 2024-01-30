import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

const gameStatus = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Finished",
    value: "finished",
  },
  {
    label: "Open",
    value: "open",
  },
  {
    label: "Progress",
    value: "progress",
  },
];

interface SelectGameFilterProps {
  setGameStatusValue: Dispatch<SetStateAction<string>>;
  value: string;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const SelectGameStatus: FC<SelectGameFilterProps> = ({
  setGameStatusValue,
  value,
  setCurrentPage,
}) => {
  const handleSelectionChange = (value: string) => {
    setGameStatusValue(value);
  };

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        label="Select game status"
        className="max-w-xs"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setCurrentPage(1);
          handleSelectionChange(e.target.value ? e.target.value : "");
        }}
        selectedKeys={[value]}
      >
        {gameStatus.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default SelectGameStatus;
