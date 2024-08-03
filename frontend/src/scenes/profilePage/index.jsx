import { Box, useMediaQuery, Button, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";
import FollowersWidget from "scenes/widgets/FollowersWidget";
import FollowingWidget from "scenes/widgets/FollowingWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import TotalLikesWidget from "scenes/widgets/TotalLikesWidget";
import TopLikerWidget from "scenes/widgets/TopLikerWidget";
import { setFollowing } from "state";
import ChangePasswordDialog from 'scenes/profilePage/ChangePassword';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const loggedInUserId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;
  const navigate = useNavigate();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  const getUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);

      const followingResponse = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}/following/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const isFollowingData = await followingResponse.json();
      setIsFollowing(isFollowingData.isFollowing);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const toggleFollowing = async () => {
    try {
      console.log(`Sending PATCH request to ${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}`);
                  const response = await fetch(
                    `${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}/${userId}`,
                    {
                      method: "DELETE",
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
      dispatch(setFollowing({ following: data }));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error during toggleFollowing:', error);
    }
  };
  const deleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed){
    try {
          const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          alert('Account deleted successfully');
          navigate('/login');
          // Redirect user or handle post-deletion logic here
        } catch (error) {
          console.error('Error during account deletion:', error);
        }
    }
  };
  const passwordChange = async (oldPassword, newPassword) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}/password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Old password is incorrect');
      }

      alert('Password changed successfully');
      setOpenPasswordDialog(false);
    } catch (error) {
      console.error('Error during password change:',error);
      alert(error);
    }
  };
  useEffect(() => {
    getUser();
  }, [userId, loggedInUserId, token]);

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          {loggedInUserId !== userId && (
            <Button
              variant="contained"
              color={isFollowing ? "secondary" : "primary"}
              onClick={toggleFollowing}
              sx={{ mt: "1rem", backgroundColor: primaryLight, color: primaryDark }}
              startIcon={isFollowing ? <PersonRemoveOutlined /> : <PersonAddOutlined />}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
          <Box m="2rem 0" />
          {loggedInUserId === userId && (
            <>
              <Button
                              variant="contained"
                              color="error"
                              onClick={deleteAccount}
                              sx={{ mt: "1rem" }}
                            >
                              Delete Account
                            </Button>
              <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setOpenPasswordDialog(true)}
                              sx={{ mt: "1rem", ml: "1rem" }}
                            >
                              Change Password
                            </Button>
              <FollowersWidget userId={userId} />
              <Box m="2rem 0" />
              <FollowingWidget userId={userId} />
            </>
          )}
          <Box m="2rem 0" />
          <TotalLikesWidget userId={userId} />
          <Box m="2rem 0" />
          <TopLikerWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
      <ChangePasswordDialog
              open={openPasswordDialog}
              onClose={() => setOpenPasswordDialog(false)}
              onChangePassword={passwordChange}
              oldPassword = {oldPassword}
              setOldPassword = {setOldPassword}
              newPassword = {newPassword}
              setNewPassword = {setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
            />
    </Box>

  );
};

export default ProfilePage;
