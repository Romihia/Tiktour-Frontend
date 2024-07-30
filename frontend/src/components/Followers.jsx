import { PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFollowers } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Followers = ({ followerId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const followers = useSelector((state) => state.followers || []);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFollower = Array.isArray(followers) ? followers.find((follower) => follower._id === followerId) : false;

  const removeFollower = async () => {
    try {
      console.log(`Sending PATCH request to ${process.env.REACT_APP_URL_BACKEND}/users/${_id}/remove-follower/${followerId}`);
      const response = await fetch(
        `${process.env.REACT_APP_URL_BACKEND}/users/${_id}/remove-follower/${followerId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response data:', data);

      dispatch(setFollowers({ followers: data }));
    } catch (error) {
      console.error('Error during removeFollower:', error);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${followerId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {isFollower && (
        <IconButton
          onClick={removeFollower}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Followers;