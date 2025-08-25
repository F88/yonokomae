import type { FC } from "react";
import "./Field.css";
import type { Neta } from "../../types/types";
import { NetaView } from "../Neta";
import { Separator } from "../ui/separator";

export type FieldProps = {
  yono: Neta;
  komae: Neta;
};

export const Field: FC<FieldProps> = ({ yono, komae }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-10 py-8 w-full">
        {/* YONO  */}
        <div className="flex-1 min-w-[280px] max-w-[360px] flex flex-col items-center bg-gray-50 rounded-lg shadow p-4">
          <NetaView {...yono} />
        </div>
        {/* KOMAE  */}
        <div className="flex-1 min-w-[280px] max-w-[360px] flex flex-col items-center bg-gray-50 rounded-lg shadow p-4">
          <NetaView {...komae} />
        </div>
        <Separator className="my-6" />
      </div>
    </>
  );
};
