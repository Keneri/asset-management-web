import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

function NavBar({ setTheme }: { setTheme: (theme: string) => void }) {
  const onThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <div className="navbar bg-base-300 rounded-bl-[40px] p-4 pb-16 flex items-start">
      <div className="flex-1 flex-col items-start">
        <span className="text-md tracking-widest">WELCOME</span>
        <span className="text-xl font-bold">User</span>
      </div>
      <div className="flex-none">
        {/* <label className="flex cursor-pointer gap-1 items-center">
          <MdLightMode size={20} />
          <input
            type="checkbox"
            value="dark"
            className="toggle theme-controller"
            onChange={onThemeChange}
          />
          <MdDarkMode size={20} />
        </label> */}

        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            value="dark"
            onChange={onThemeChange}
            checked={localStorage.getItem("theme") === "dark" ? true : false}
          />
          <MdLightMode size={40} className="swap-off" />
          <MdDarkMode size={40} className="swap-on" />
        </label>
      </div>
    </div>
  );
}

export default NavBar;
