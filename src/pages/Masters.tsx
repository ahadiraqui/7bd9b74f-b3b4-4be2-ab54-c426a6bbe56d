import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepartmentMaster from "@/components/masters/DepartmentMaster";
import DesignationMaster from "@/components/masters/DesignationMaster";
import LocationMaster from "@/components/masters/LocationMaster";

const Masters = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Masters</h2>
        <p className="text-muted-foreground mt-1">
          Configure departments, designations, and locations
        </p>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="departments" className="mt-6">
          <DepartmentMaster />
        </TabsContent>
        <TabsContent value="designations" className="mt-6">
          <DesignationMaster />
        </TabsContent>
        <TabsContent value="locations" className="mt-6">
          <LocationMaster />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Masters;
