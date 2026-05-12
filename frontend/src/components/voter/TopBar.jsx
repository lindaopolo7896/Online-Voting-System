import { IoMdMenu } from "react-icons/io";
import { useSidebar } from "../../hooks/useSidebar";
function TopBar({ page }) {
  const { open, setOpen } = useSidebar();

  function handleOpen() {
    setOpen(!open);
  }
  return (
    <div className="fixed top-0 left-0 lg:left-80 right-0 h-20 z-10 flex justify-between py-6 px-6 shadow-lg bg-white">
      <div className="flex items-center justify-center gap-4">
        <IoMdMenu className="text-2xl cursor-pointer" onClick={handleOpen} />
        <h1 className="text-2xl font-bold">{page}</h1>
      </div>
      <h1>profile</h1>
    </div>
  );
}

export default TopBar;
