import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";
import { getDashboardData } from "@/api/project/projectApiServices";


const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Projects", value: 0 },
    { title: "Pending Projects", value: 0 },
    { title: "Completed Projects", value: 0 },
    { title: "Users Created", value: 0 },
  ]);

  const [barData, setBarData] = useState<{ name: string; projects: number }[]>([]);

  const COLORS = ["#34D399", "#FBBF24", "#60A5FA"];

  const pieData = [
    { name: "Completed", value: stats[2].value },
    { name: "Pending", value: stats[1].value },
    { name: "Ongoing", value: stats[0].value - stats[1].value - stats[2].value },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get("/api/projects/dashboard");
        // const data = response.data;
        const data = await getDashboardData();
        console.log(data, "dashboard data");

        setStats([
          { title: "Total Projects", value: data.projectCount },
          { title: "Pending Projects", value: data.todoProjectCount },
          { title: "Completed Projects", value: data.inProgressProjectCount },
          { title: "Users Created", value: data.userCount },
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedBarData = data.monthwiseProjectCount.map((item: any) => ({
          name: monthNames[item.month - 1],
          projects: item.projectCount,
        }));

        setBarData(formattedBarData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="text-center">
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projects" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent className="h-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
