import DashboardLayout from "@/components/dashboard/overview/DashboardLayout";

const Profile = () => {
  const handlePageChange = (page: string) => {
    // Handle page changes if needed
  };

  return (
    <DashboardLayout onPageChange={handlePageChange} />
  );
};

export default Profile;