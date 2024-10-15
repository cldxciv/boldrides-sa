/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { Button, MenuItem, Select } from "@mui/material";
// import AddDriver from "./AddDriver";
import LoadingAnimation from "../common/LoadingAnimation";
import addDriver from "../../assets/addDriver.svg";
import twoLeft from "../../assets/twoLeft.svg";
import oneLeft from "../../assets/oneLeft.svg";
import twoRight from "../../assets/twoRight.svg";
import { MoreVert } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  styled
} from "@mui/material";
import CustomSelectDropdown from "../common/CustomSelectDropdown";
import settingsIcon from "../../assets/settingsIcon.svg";
import driverImage from "../../assets/driver.png";
import wrongIcon from "../../assets/wrongIcon.svg";
import searchIcon from "../../assets/searchIcon.svg";
import redDot from "../../assets/redDot.svg";
import greenDot from "../../assets/greenDot.svg";
import infoYellow from "../../assets/infoYellow.svg";
import organisatiologo from "../../assets/organisationlogo.jpeg";

const ColorButton = styled(Button)(({ theme }) => ({
  fontFamily: "Red Hat Display, sans-serif",
}));


const Drivers = ({ onDriverClick }) => {
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [allDrivers, setAllDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [state, setState] = useState("");
  const [assignment, setAssignment] = useState("");
  const [documents, setDocuments] = useState("");
  const [search, setSearch] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [allornew, setallornew] = useState("All");
  const [filteredRides, setFilteredRides] = useState([{
    name: "Reliance Industries Ltd.",
    totalVehicles: 100,
    totalDrivers: 80,
    DOR: "01/01/2024", // Assuming it's a date of registration
    verificationStatus: { errors: 1, warnings: 4 }
  },
  {
    name: "Reliance Industries Ltd.",
    totalVehicles: 150,
    totalDrivers: 120,
    DOR: "15/03/2024",
    verificationStatus: { errors: 0, warnings: 0 }
  },
  {
    name: "Reliance Industries Ltd.",
    totalVehicles: 200,
    totalDrivers: 180,
    DOR: "20/05/2024",
    verificationStatus: { errors: 0, warnings: 0 }
  },
  {
    name: "Reliance Industries Ltd.",
    totalVehicles: 50,
    totalDrivers: 45,
    DOR: "10/07/2024",
    verificationStatus: { errors: 1, warnings: 4 }
  }
]);


  const fetchAllDrivers = useCallback(async () => {
    const orgId = localStorage.getItem("org_id");
    const url = `https://boldrides.com/api/boldriders/organization/${orgId}/getAllDrivers`;
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        setError("Error in fetching drivers!");
        setLoading(false);
        return;
      }
      const response = await res.json();
      setAllDrivers(response.drivers);
      setFilteredDrivers(response.drivers);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDrivers();
  }, [fetchAllDrivers]);

  const handleFilter = useCallback(() => {
    let filtered = allDrivers;

    if (!showAll) {
      if (state) {
        state === "Active"
          ? (filtered = filtered.filter(
              (driver) => driver?.status === "ONLINE"
            ))
          : (filtered = filtered.filter(
              (driver) => driver?.status !== "ONLINE"
            ));
      }
      if (assignment) {
        assignment === "Not assigned"
          ? (filtered = filtered.filter(
              (driver) => driver?.vehicle_id === null
            ))
          : (filtered = filtered.filter(
              (driver) => driver?.vehicle_id !== null
            ));
      }
      if (documents) {
        filtered = filtered.filter((driver) => {
          const docs = driver?.documents || {};
          const docCount = Object.keys(docs).length;
          const approvedCount = Object.values(docs).filter(
            (doc) => doc?.status === "APPROVED"
          ).length;
          const pendingCount = Object.values(docs).filter(
            (doc) => doc?.status === "PENDING"
          ).length;

          if (documents === "Approved") {
            return docCount === 4 && approvedCount === 4;
          }
          if (documents === "Pending") {
            return pendingCount > 0;
          }
          if (documents === "Lacking") {
            return docCount < 4;
          }
          return true;
        });
      }
    }

    if (search) {
      filtered = filtered.filter((driver) =>
        driver?.full_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredDrivers(filtered);
  }, [state, assignment, search, showAll, documents, allDrivers]);

  useEffect(() => {
    handleFilter();
  }, [showAll, state, assignment, search, handleFilter]);

  const handleStateChange = (event) => {
    const value = event.target.value;
    setShowAll(false);
    setState((prev) => (prev === value ? "" : value));
  };
  const handleAssignmentChange = (event) => {
    const value = event.target.value;
    setShowAll(false);
    setAssignment((prev) => (prev === value ? "" : value));
  };
  const handleDocumentsChange = (event) => {
    const value = event.target.value;
    setShowAll(false);
    setDocuments((prev) => (prev === value ? "" : value));
  };

  const handleEmailInvite = async () => {
    const orgId = localStorage.getItem("org_id");
    const url = `https://boldrides.com/api/boldriders/organization/${orgId}/sentInvitationLinkToDriver`;
    const data = {
      email: input,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const result = await response.json();
        setAddError(result.message);
        setAddLoading(false);
        return;
      }
      setAddSuccess(true);
    } catch (err) {
      setAddError(err);
    } finally {
      setAddLoading(false);
      setInput("");
    }
  };

  const handlePhoneInvite = () => {};

  const handleAddDriver = () => {
    setAddLoading(true);
    setAddError("");
    setAddSuccess(false);
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\+[0-9]{1,4}[0-9]{6,}$/;

    if (emailRegex.test(input)) {
      handleEmailInvite();
    } else if (phoneRegex.test(input)) {
      handlePhoneInvite();
    } else {
      setAddLoading(false);
      setAddError("Enter a valid email or mobile number with country code!");
      return;
    }
  };

  const handleMenuOpen = (event, driver) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDriver(driver);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedDriver(null);
  };

  const handleAllClick = () => {
    setShowAll(true);
    setState("");
    setAssignment("");
    setDocuments("");
    setSearch("");
    setFilteredDrivers(allDrivers);
  };

  const handleEditDriver = () => {
    onDriverClick(selectedDriver?._id);
  };

  const handleRemoveDriver = async () => {
    const orgId = localStorage.getItem("org_id");
    const url = `https://boldrides.com/api/boldriders/organization/${orgId}/disassociateDriver/`;
    setLoading(true);
    try {
      const response = await fetch(`${url}${selectedDriver._id}`, {
        method: "POST",
      });
      if (!response.ok) {
        setError("Error in deleting this driver");
        setLoading(false);
        return;
      }
      fetchAllDrivers();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const getVerificationStatus = (documents) => {
    const totalDocs = 4;
    if (!documents || Object.keys(documents).length === 0) {
      return {
        status: false,
        notUploadedCount: totalDocs,
        pendingCount: 0,
        approvedCount: 0,
      };
    }

    const pendingCount = Object.values(documents).filter(
      (doc) => doc?.status === "PENDING"
    ).length;
    const approvedCount = Object.values(documents).filter(
      (doc) => doc?.status === "APPROVED"
    ).length;
    const notUploadedCount = totalDocs - Object.keys(documents).length;

    const allApproved = approvedCount === totalDocs;

    return {
      status: allApproved,
      notUploadedCount,
      pendingCount,
      approvedCount,
    };
  };

  if (loading) {
    return (
      <div className="mx-auto w-full h-full ">
        <LoadingAnimation height={500} width={500} />
      </div>
    );
  }

  if (error) {
    return (
      <h1 className="text-red-400 font-redhat text-3xl p-4 font-bold">
        {error}
      </h1>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Drivers</h1>
        {/* <Button
          variant="contained"
          startIcon={<img src={addDriver} alt="Add vehicle" />}
          sx={{
            backgroundColor: showAddVehicleModal ? "#BBBBBB" : "black",
            color: "white",
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: showAddVehicleModal ? "#BBBBBB" : "black",
            },
          }}
          onClick={() => {
            setAddError("");
            setShowAddVehicleModal((prevValue) => !prevValue);
          }}
        >
          Invite Driver
        </Button> */}
      </div>
      {/* {showAddVehicleModal && (
        <AddDriver
          input={input}
          setInput={setInput}
          handleAddDriver={handleAddDriver}
          handleClose={() => {
            setAddError("");
            setShowAddVehicleModal((prevValue) => !prevValue);
          }}
          addLoading={addLoading}
          addError={addError}
          addSuccess={addSuccess}
        />
      )} */}
      {filteredDrivers.length === 0 && (
        <p className="text-red-400 font-redhat text-xl p-4 font-bold">
          No drivers invited till now!
        </p>
      )}

<div className="flex justify-between">
              <div className="flex space-x-4 h-10">
                <Button
                  variant={showAll ? "contained" : "outlined"}
                  sx={{
                    border: "none",
                    textTransform: "none",
                    fontWeight: "600",
                    fontSize: "16px",
                    backgroundColor: showAll ? "black" : "#EEEEEE",
                    color: showAll ? "white" : "black",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: showAll ? "black" : "#EEEEEE",
                      border: "none",
                    },
                  }}
                  onClick={handleAllClick}
                >
                  All
                </Button>
                <CustomSelectDropdown
                  value={state}
                  onChange={handleStateChange}
                  name="Organisation"
                  options={["Active", "Inactive"]}
                />
                <CustomSelectDropdown
                  value={assignment}
                  onChange={handleAssignmentChange}
                  name="Assignment"
                  options={["Assigned", "Not assigned"]}
                />
                <CustomSelectDropdown
                  value={documents}
                  onChange={handleDocumentsChange}
                  name="Documents"
                  options={[
                    "Approved",
                    "Pending",
                    "Lacking",
                    "Rejected Documents",
                    "About to expire",
                  ]}
                />
              </div>
              <div className="flex space-x-4 h-10">
                <TextField
                  variant="outlined"
                  placeholder="Search for drivers"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={searchIcon}
                          alt="search icon"
                          style={{ width: 25 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: "150%",
                    ".MuiOutlinedInput-input": {
                      padding: "10px 4px",
                    },
                  }}
                />
              </div>
            </div>

<div className="flex gap-6">
        <div className={`pb-[6px] pr-3 ${allornew==="All"?"border-b-[3px] border-[#18C4B8]":""}`} onClick={()=>setallornew("All")}>
          <p className={`font-redhat font-bold text-base ${allornew!=="All"?"text-[#777777] font-normal":""}`}>Drivers</p>
        </div>
        <div className={`pb-[6px] pr-3 ${allornew==="New"?"border-b-[3px] border-[#18C4B8]":""}`} onClick={()=>setallornew("New")}>
          <p className={`font-redhat font-bold text-base ${allornew!=="New"?"text-[#777777] font-normal":""}`}>New applicants</p>
        </div>
      </div>
      {allornew==="All"?filteredDrivers && filteredDrivers.length !== 0 && (
        <>
          <div className="flex flex-col gap-8">

            <TableContainer>
              <Table
                sx={{
                  border: "1px solid rgba(221, 221, 221, 1)",
                }}
              >
                <TableHead
                  sx={{
                    backgroundColor: "rgba(238, 238, 238, 1)",
                    borderRadius: "10px",
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Driver name and ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Assignment
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Contacts
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Verification status
                    </TableCell>
                    <TableCell align="right">
                      <img src={settingsIcon} alt="settingsIcon" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDrivers.map((driver, index) => {
                    const documents = driver?.documents || {};
                    const { status, notUploadedCount, pendingCount } =
                      getVerificationStatus(documents);
                    return (
                      <TableRow key={index}>
                        <TableCell onClick={() => onDriverClick(driver?._id)}>
                          <div className="flex items-center cursor-pointer">
                            <img
                              src={driverImage}
                              alt="vehicle"
                              className="mr-2"
                            />
                            <p className="font-redHat font-bold text-base">
                              {driver?.full_name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {driver?.status === "ONLINE" ? (
                            <span className="flex gap-2">
                              <img src={greenDot} alt="greenDot" />
                              <p className="font-redhat text-base font-semibold">
                                Active
                              </p>
                            </span>
                          ) : (
                            <span className="flex gap-2">
                              <img src={redDot} alt="redDot" />
                              <p className="font-redhat text-base font-semibold">
                                Inactive
                              </p>
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="font-redhat text-base font-semibold">
                            {driver?.vehicle_id !== null
                              ? "Assigned"
                              : "Not Assigned"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-redhat text-base font-semibold">
                            {driver?.phone_number}
                          </p>
                          <p className="font-redhat text-base font-semibold text-semiGray mt-1">
                            {driver?.email}
                          </p>
                        </TableCell>
                        <TableCell>
                          {status ? (
                            <span className="bg-[#e6f7e6] px-4 py-2 rounded-2xl text-[#28a745]">
                              Approved
                            </span>
                          ) : (
                            <div className="flex">
                              {notUploadedCount > 0 && (
                                <span
                                  className={`bg-[#f9ecea] pl-4 pr-2 py-2 ${
                                    pendingCount > 0
                                      ? "rounded-l-2xl"
                                      : "rounded-2xl"
                                  } text-[#D40038] flex items-center`}
                                >
                                  <img
                                    src={wrongIcon}
                                    alt="wrongIcon"
                                    className="mr-1"
                                  />
                                  <p>{notUploadedCount}</p>
                                </span>
                              )}
                              {pendingCount > 0 && (
                                <span
                                  className={`bg-[#f9ecea] pl-2 pr-4 py-2 ${
                                    notUploadedCount > 0
                                      ? "rounded-r-2xl"
                                      : "rounded-2xl"
                                  } text-[#C07000] flex items-center`}
                                >
                                  <img
                                    src={infoYellow}
                                    alt="infoYellow"
                                    className="mr-1"
                                  />
                                  <p>{pendingCount}</p>
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, driver)}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            anchorEl={menuAnchor}
                            open={Boolean(menuAnchor)}
                            onClose={handleMenuClose}
                          >
                            <MenuItem onClick={handleEditDriver}>Edit</MenuItem>
                            <MenuItem onClick={handleRemoveDriver}>
                              Remove
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="flex justify-between items-center">
            <Select
              value="10"
              onChange={() => {}}
              sx={{
                backgroundColor: "white",
                fontWeight: "600",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="10">10 lines</MenuItem>
              <MenuItem value="20">20 lines</MenuItem>
              <MenuItem value="50">50 lines</MenuItem>
            </Select>
            <div className="flex gap-4">
              <Button
                sx={{
                  color: "rgba(119, 119, 119, 1)",
                  paddingInline: "20px",
                  paddingBlock: "10px",
                  backgroundColor: "rgba(238, 238, 238, 1)",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(238, 238, 238, 1)",
                  },
                }}
              >
                <img src={twoLeft} alt="twoLeft" className="mr-1" />
                First page
              </Button>
              <Button
                sx={{
                  color: "rgba(119, 119, 119, 1)",
                  paddingInline: "20px",
                  backgroundColor: "rgba(238, 238, 238, 1)",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(238, 238, 238, 1)",
                  },
                }}
              >
                <img src={oneLeft} alt="oneLeft" className="mr-2" />
                Anterior
              </Button>
              <Button
                sx={{
                  color: "rgba(119, 119, 119, 1)",
                  paddingInline: "20px",
                  backgroundColor: "rgba(238, 238, 238, 1)",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(238, 238, 238, 1)",
                  },
                }}
              >
                Following
                <img src={twoRight} alt="twoRight" className="ml-1" />
              </Button>
            </div>
          </div>
        </>
      ):<>{filteredRides.map((org)=>{
        return <div className="py-6 border-b border-[#DDDDDD] flex justify-between items-center " onClick={()=>onMenuItemClick("Neworganisationinfo")}>
            <div className="flex gap-3 ">
               <img
                 src={organisatiologo}
                 alt=""
                 className="w-[80px] rounded-full"
               />
               <div className="flex flex-col justify-between py-1">
                 {" "}
                 <p className="font-bold text-base font-redhat ">{org.name}</p>
                 <p className="font-bold text-base font-redhat">
                   Driver: {org.totalDrivers}
                 </p>
                 <p className="font-bold text-base font-redhat">
                 Vehicles: {org.totalVehicles}
                 </p>
               </div>
             </div>
             <div className="flex flex-row-reverse gap-3">
           <ColorButton
             variant="contained"
             sx={{
               backgroundColor: "black",
               fontWeight: 600,
               color: "white",
               fontFamily: "Red Hat Display, sans-serif",
               textTransform: "none",
               padding: "12px 24px",
               borderRadius: "8px",
               "&:hover": {
                 backgroundColor: "black",
               },
             }}
             // onClick={handleSubmit}
           >
             Approve
           </ColorButton>
           <ColorButton
             className="text-xs md:text-sm lg:text-base"
             variant="contained"
             sx={{
               backgroundColor: "#EEEEEE",
               fontWeight: 600,
               color: "black",
               textTransform: "none",
               padding: "12px 16px",
               borderRadius: "8px",
               "&:hover": {
                 backgroundColor: "#EEEEEE",
               },
             }}
             // onClick={handleReset}
           >
             Decline
           </ColorButton>
         </div>
         </div>
       })}</>}
    </div>
  );
};

export default Drivers;
