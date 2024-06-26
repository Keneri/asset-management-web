import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

function NavBar() {
  return (
    <div className="navbar bg-base-300 rounded-bl-[40px] p-4 pb-16">
      <div className="flex-1 flex-col items-start">
        <span className="text-md tracking-widest">WELCOME</span>
        <span className="text-xl font-bold">User</span>
      </div>
      <div className="flex-none">
        <label className="flex cursor-pointer gap-1 items-center">
          <MdLightMode size={20} />
          <input
            type="checkbox"
            value="dark"
            className="toggle theme-controller"
          />
          <MdDarkMode size={20} />
        </label>
      </div>
    </div>
  );
}

export default NavBar;
