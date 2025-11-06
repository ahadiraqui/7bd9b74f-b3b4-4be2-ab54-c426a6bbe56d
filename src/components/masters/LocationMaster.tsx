import { useState } from "react";
import MasterCRUD from "./MasterCRUD";

export interface Location {
  id: string;
  name: string;
  address: string;
}

const LocationMaster = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  return (
    <MasterCRUD
      title="Locations"
      items={locations}
      onItemsChange={setLocations}
      fields={[
        { name: "name", label: "Location Name", type: "text", required: true },
        { name: "address", label: "Address", type: "text", required: false },
      ]}
    />
  );
};

export default LocationMaster;
