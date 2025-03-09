import { X, Menu } from "lucide-react";
import { useState } from "react";
import CustomIcon from "../assets/react.svg";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();

  const home = () => {
    navigate("/");
  };
  const events = () => {
    navigate("/events");
  };

  const seminar = () => {
    navigate("/seminar");
  };

  const contact = () => {
    navigate("/contact");
  };

  const about = () => {
    navigate("/about");
  };

  const fashionShow = () => {
    navigate("/fashion-show");
  };

  const schedule = () => {
    navigate("/schedule");
  };
  const adminDashboard = () => {
    navigate("/admin/dashboard");
  };

  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={home}
      >
        Home
      </button>
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={events}
      >
        Events
      </button>
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={seminar}
      >
        Seminar
      </button>
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={schedule}
      >
        Schedule
      </button>
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={fashionShow}
      >
        Fashion Show
      </button>
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={about}
      >
        About Us
      </button>
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={contact}
      >
        Contact
      </button>{" "}
      <button
        className="text-white hover:text-accent-mint transition-colors"
        onClick={adminDashboard}
      >
        Admin
      </button>
    </>
  );

  return (
    <>
      <nav className="bg-surface-dark bg-opacity-90 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto flex items-center justify-between pl-[5%] ">
          <div className="flex items-center gap-2" onClick={home}>
            <img src={CustomIcon} className="h-20 w-20 p" alt="Logo" />
            <div className="flex flex-col">
              <span className="text-white font-bold hidden lg:block ">
                AKNM GPTC THIRURANGADI
              </span>
              <span className="text-white font-bold lg:hidden block ">
                AKNM GPTCT
              </span>
              <span className="font-display text-2xl font-bold text-white">
                NAUKA 25
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {/* lg: 768px */}
          <div className="hidden lg:flex gap-6 mr-[8%]">
            <NavItems />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`
			  fixed top-0 right-0 h-full w-64 bg-surface-dark transform transition-transform duration-300 ease-in-out bg-opacity-50
			  ${isOpen ? "translate-x-0" : "translate-x-full"}
			  lg:hidden
			  z-50
			`}
      >
        {/* Drawer Content */}
        <div className="flex flex-col p-6 gap-6">
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <NavItems />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="h-[1px] bg-primary" />
    </>
  );
}

export default NavigationBar;
