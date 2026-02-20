import UserMenu from "../common/UserMenu";
import DarkModeToggle from "../common/DarkModeToggle";
import { format } from "date-fns";
import { HiCalendar, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";
import { useState, useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useTranslation } from "react-i18next";
import {
  Link,
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destination, setDestination] = useState(
    searchParams.get("destination") || "",
  );
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const dateRef = useRef();
  const { i18n } = useTranslation();

  const handleOptions = (name, opration) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: opration === "inc" ? options[name] + 1 : options[name] - 1,
      };
    });
  };
  useOutsideClick(dateRef, "dateDropDown", () => setOpenDate(false));

  const navigate = useNavigate();
  const handleSearch = () => {
    const encodedParams = createSearchParams({
      destination: destination,
      date: JSON.stringify(date),
      options: JSON.stringify(options),
    });

    setSearchParams(encodedParams);
    navigate({
      pathname: "/search",
      search: encodedParams.toString(),
    });
  };

  return (
    <div className="header">
      {/* Logo */}

      <Link to="/" className="flex items-center gap-2 mr-4">
        <span className="text-xl font-bold text-purple-600">
          🏨 BookingHotel
        </span>
      </Link>
      <nav className="flex gap-4 items-center">
        <a
          href="/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:underline"
        >
          Privacy Policy
        </a>
        <a
          href="/terms.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:underline"
        >
          Terms
        </a>
      </nav>

      <div className="headerSearch">
        <div className="headerSearchItem">
          <MdLocationOn className="headerIcon locationIcon" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            type="text"
            placeholder="where to go?"
            className="headerSearchInput"
            name="destination"
            id="destination"
          />
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <HiCalendar className="headerIcon dateIcon" />
          <div
            className="dateDropDown"
            onClick={() => setOpenDate((is) => !is)}
            id="dateDropDown"
          >
            {`${format(date[0].startDate, "MM/dd/yyyy")} to 
            ${format(date[0].endDate, "MM/dd/yyyy")}`}
          </div>
          {openDate && (
            <div className="date" ref={dateRef}>
              <DateRange
                ranges={date}
                onChange={(item) => setDate([item.selection])}
                minDate={new Date()}
                moveRangeOnFirstSelection={true}
              />
            </div>
          )}
        </div>
        <div className="headerSearchItem">
          <div id="optionDropDown" onClick={() => setOpenOptions((is) => !is)}>
            {options.adult} adult &bull; {options.children} children &bull;{" "}
            {options.room} room
          </div>
          {openOptions && (
            <GuestOptionList
              handleOptions={handleOptions}
              options={options}
              setOpenOptions={setOpenOptions}
            />
          )}
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <button className="headerSearchBtn" onClick={handleSearch}>
            <HiSearch className="headerIcon" />
          </button>
        </div>
      </div>

      {/* Right side - Dark mode & User menu */}
      <div className="flex items-center gap-3 ml-4">
        <DarkModeToggle />
        <UserMenu />
        <select
          className="ml-4 px-2 py-1 rounded border"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
    </div>
  );
}

function GuestOptionList({ options, handleOptions, setOpenOptions }) {
  const optionsRef = useRef();
  useOutsideClick(optionsRef, "optionDropDown", () => setOpenOptions(false));
  return (
    <div className="guestOptions" ref={optionsRef}>
      <OptionItem
        handleOptions={handleOptions}
        type="adult"
        options={options}
        minLimit={1}
      />
      <OptionItem
        handleOptions={handleOptions}
        type="children"
        options={options}
        minLimit={0}
      />
      <OptionItem
        handleOptions={handleOptions}
        type="room"
        options={options}
        minLimit={1}
      />
    </div>
  );
}

function OptionItem({ options, type, minLimit, handleOptions }) {
  return (
    <div className="guestOptionItem">
      <span className="optionText">{type}</span>
      <div className="optionCounter">
        <button
          className="optionCounterBtn"
          onClick={() => handleOptions(type, "dec")}
          disabled={options[type] <= minLimit}
        >
          <HiMinus className="icon" />
        </button>
        <span className="optionCounterNumber">{options[type]}</span>
        <button
          className="optionCounterBtn"
          onClick={() => handleOptions(type, "inc")}
        >
          <HiPlus className="icon" />
        </button>
      </div>
    </div>
  );
}
