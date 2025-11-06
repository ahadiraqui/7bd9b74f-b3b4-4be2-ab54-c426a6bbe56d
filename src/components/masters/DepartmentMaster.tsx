import { useState } from "react";
import MasterCRUD from "./MasterCRUD";

export interface Department {
  id: string;
  name: string;
  description: string;
}

const DepartmentMaster = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  return (
    <MasterCRUD
      title="Departments"
      items={departments}
      onItemsChange={setDepartments}
      fields={[
        { name: "name", label: "Department Name", type: "text", required: true },
        { name: "description", label: "Description", type: "text", required: false },
      ]}
    />
  );
};

export default DepartmentMaster;
