import BottomNav from "../components/shared/BottomNav";
import CallsHeader from "../components/call/CallsHeader";
import DesktopSidebar from "../components/shared/DesktopSidebar";
import UserCall from "../components/call/UserCall";

function Calls() {
  return (
    <>
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:pt-4">
        <CallsHeader />
        <UserCall />
        <UserCall />
        <UserCall />
        <UserCall />
        <UserCall />
        <UserCall />
        <UserCall />
        <UserCall />
        <UserCall />
        <UserCall />
      </div>
      <div className="pt-16 lg:hidden">
        <BottomNav />
      </div>
    </>
  );
}

export default Calls;
