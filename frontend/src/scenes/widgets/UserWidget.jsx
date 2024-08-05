import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  StarOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [rank, setRank] = useState(null); // State to hold the rank
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const fetchUserData = async () => {
    try {
      // Fetch user details
      const userResponse = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user rank
      const rankResponse = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}/rank`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const rankData = await rankResponse.json();
      setRank(rankData.rank); // Set the rank in state
    } catch (error) {
      console.error("Error fetching user data or rank:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId, token]);

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    username,
    dateOfBirth,
  } = user;
  
  const fixedBirthdayDate = dateOfBirth === null ? "No birthday given" : dateOfBirth.slice(0,10);

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName === null ? "First Name" : firstName} {lastName === null ? "Last Name" : lastName}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <StarOutlined  fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{rank || "Loading..."}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Birthday Date</Typography>
          <Typography color={main} fontWeight="500">
            {fixedBirthdayDate}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Username</Typography>
          <Typography color={main} fontWeight="500">
            {username}
          </Typography>
        </FlexBetween>
      </Box>

    </WidgetWrapper>
  );
};

export default UserWidget;
