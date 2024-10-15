/* eslint-disable react/prop-types */
import { Button, Card, Typography, styled } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import profileImage from "../../assets/profile.png";
import carImage from "../../assets/carBigImage.png";
import LoadingAnimation from "../common/LoadingAnimation";
import callicon from "../../assets/calliconsa.svg";
import msgicon from "../../assets/messageiconsa.svg";


const DynamicButton = styled(Button)(({ theme, bgColor, padding, btntext="black" }) => ({
    fontFamily: "Red Hat Display, sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "initial",
    color: btntext,
    borderWidth: "2px",
    borderColor: "#EEEEEE",
    borderStyle: "solid",
    backgroundColor: bgColor || "transparent", // Default transparent if no bgColor is passed
    borderRadius: "8px",
    padding:padding
  }));

const DriverInfo = ({
  selectedDriverId,
  setActiveComponent,
  setSelectedDriver,
}) => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [viewError, setViewError] = useState("");

  const fetchDriverData = useCallback(async () => {
    const orgId = localStorage.getItem("org_id");
    const url = `https://boldrides.com/api/boldriders/organization/${orgId}/driver/${selectedDriverId}`;
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        setError("Error in fetching driver details!");
        setLoading(false);
        return;
      }
      const response = await res.json();
      setDriverDetails(response.driver);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDriverId]);

  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

  if (loading) {
    return (
      <div className="mx-auto w-full h-full ">
        <LoadingAnimation height={500} width={500} />
      </div>
    );
  }

  if (error) {
    return <h1 className="text-red-400 text-3xl p-4 font-bold">{error}</h1>;
  }

  return (
    <div className="p-6">
      <div className="mb-10 flex justify-between  items-center cursor-pointer">
        <div className="flex items-center">
        <ArrowBackIcon
          sx={{ mr: 2 }}
          onClick={() => {
            setSelectedDriver(null);
            setActiveComponent("Drivers");
          }}
        />
        <Typography sx={{ fontSize: "24px", fontWeight: "700" }}>
          Return to Drivers
        </Typography>
        </div>
        <div className="flex gap-6 ">
            <DynamicButton bgColor={"white"} padding={"12px 15px"}>Ask for review</DynamicButton>
            <DynamicButton bgColor={"#00000080"} padding={"12px 70px"} btntext={"white"}>Approve driver</DynamicButton>
        </div>
      </div>
      <div className="mb-10 flex justify-between">
        <div className="flex flex-col flex-1 gap-6">
          <Typography sx={{ fontWeight: "bold", fontSize: "40px" }}>
            {driverDetails?.full_name}
          </Typography>
          <div className="flex flex-1 justify-between w-[70%]">
            <div className="flex flex-col">
              <Typography
                variant="body1"
                fontWeight="700"
                sx={{ color: "rgba(153, 153, 153, 1)" }}
              >
                Phone Number
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {driverDetails?.phone_number}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body1"
                fontWeight="700"
                sx={{ color: "rgba(153, 153, 153, 1)" }}
              >
                Email
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {driverDetails?.email}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body1"
                fontWeight="700"
                sx={{ color: "rgba(153, 153, 153, 1)" }}
              >
                License Number
              </Typography>
              <Typography variant="body1" fontWeight="600">
                83 - XS -04
              </Typography>
            </div>
          </div>
        </div>
        <div className="mr-20">
          <img src={profileImage} alt="profile" width={150} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:gap-[5%]">
        <div className="md:flex-[55%]">
          <Typography
            sx={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}
          >
            Driver documents
          </Typography>
          {[
            {
              label: " TVDE Driver Certificate ",
              date: "Valid until December 25, 2024",
            },
            {
              label: "Driver’s License",
              date: "Valid until December 25, 2024",
            },
            {
              label: "Proof of Identity",
              date: "Valid until December 25, 2024",
            },
            {
              label: "Criminal Record",
              date: "Valid until December 25, 2024",
            },
          ].map((item, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: "1px solid rgba(221, 221, 221, 1)",
              }}
            >
              <div className="md:max-w-[80%]">
                <Typography variant="body1" fontWeight="700">
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="500"
                  sx={{ color: "rgba(24, 196, 184, 1)", marginTop: 1 }}
                >
                  {item.date}
                </Typography>
              </div>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "rgba(238, 238, 238, 1)",
                  color: "#000",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(238, 238, 238, 1)",
                  },
                }}
              >
                View
              </Button>
            </Card>
          ))}
        </div>
        <div className="md:flex-[40%]">
          <Typography
            sx={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}
          >
            Vehicle responsibilities
          </Typography>
          {driverDetails?.vehicle_id ? (
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                border: "1px solid rgba(221, 221, 221, 1)",
                borderRadius: "10px",
                flexWrap: "wrap",
              }}
            >
              <img src={carImage} alt="Car" className="mr-5" />
              <div>
                <Typography variant="body1" fontWeight="700">
                  {driverDetails?.vehicle_id?.vehicle_model}
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {driverDetails?.vehicle_id?.documents &&
                  Object.values(driverDetails?.vehicle_id?.documents).filter(
                    (doc) => doc.status === "APPROVED"
                  ).length === 4
                    ? "Active"
                    : "Inactive"}
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  VIN: {driverDetails?.vehicle_id?.vin}
                </Typography>
              </div>
            </Card>
          ) : (
            <p className="font-redhat ml-2">No vehicle assigned yet!</p>
          )}

<div><p className="font-redhat font-bold text-2xl mb-6 mt-8 ">Operating under</p>
          <div className="px-4 py-6 flex justify-between border border-[#DDDDDD] rounded-lg ">
            <p className="font-redhat font-bold text-base">Tesla bad electric Pvt. Ltd</p>
            <div className="flex gap-2 ">
                <img src={callicon} alt="" />
                <img src={msgicon} alt="" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
