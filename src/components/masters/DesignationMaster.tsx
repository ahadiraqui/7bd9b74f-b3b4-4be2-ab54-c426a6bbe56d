import { useState } from "react";
import MasterCRUD from "./MasterCRUD";

export interface Designation {
  id: string;
  name: string;
  level: string;
}

const DesignationMaster = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);

  return (
    <MasterCRUD
      title="Designations"
      items={designations}
      onItemsChange={setDesignations}
      fields={[
        { name: "name", label: "Designation Title", type: "text", required: true },
        { name: "level", label: "Level", type: "text", required: false },
      ]}
    />
  );
};

export default DesignationMaster;
