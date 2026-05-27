import { IoMdMenu } from "react-icons/io";
import { useSidebar } from "../../hooks/useSidebar";
function TopBar({ page }) {
  const { open, setOpen } = useSidebar();

  function handleOpen() {
    setOpen(!open);
  }
  return (
    <div className="fixed top-0 left-0 lg:left-80 right-0 h-20 z-10 flex justify-between py-6 px-6 shadow-lg bg-[#050B14] border-b border-b-white/10">
      <div className="flex items-center justify-center gap-4">
        <IoMdMenu
          className="text-2xl cursor-pointer md:hidden"
          onClick={handleOpen}
        />
        <h1 className="text-2xl text-white font-bold">{page}</h1>
      </div>
      <h1 className="text-white">profile</h1>
    </div>
  );
}

export default TopBar;
