import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, MapPin, Laptop } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Employees",
      value: "0",
      icon: Users,
      description: "Active employees",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Laptops Out",
      value: "0",
      icon: Laptop,
      description: "Assigned laptops",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Departments",
      value: "0",
      icon: Building2,
      description: "Active departments",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Locations",
      value: "0",
      icon: MapPin,
      description: "Office locations",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Welcome to MindNerves Technology Employee Management System
        </p>
      </div>

      {/* Stats Grid - Mobile Friendly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Overview - Mobile Friendly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg shrink-0">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm md:text-base">Employee Management</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Add, edit, view, and manage all employee records with
                    comprehensive information tracking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/10 p-2 rounded-lg shrink-0">
                  <Laptop className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm md:text-base">Laptop Tracking</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Track laptop assignments and returns with detailed records of
                    all devices.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">System Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg shrink-0">
                  <Building2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm md:text-base">Masters Data</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Configure and maintain departments, designations, and
                    locations for better organization.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-500/10 p-2 rounded-lg shrink-0">
                  <MapPin className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm md:text-base">Location Management</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Manage office locations and track employee distribution across
                    different sites.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
