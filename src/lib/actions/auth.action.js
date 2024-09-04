/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
  verifyPasswordResetCode,
} from "@firebase/auth";

import { useCurrentUser } from "@/lib/store";
import { fbSetDoc } from "@/lib/helpers";
import { useNotification } from "@/hooks";
import { auth, googleProvider, githubProvider } from "@/configs";
import axios from "axios";
import { toast } from "react-toastify";


export const useAuthState = () => {
  const {
    getCurrentUser,
    userProfile: profile,
    getUserProfile,
  } = useCurrentUser();
  // const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Log the token for debugging purposes
      console.log("Token found:", token);

      axios.get('http://127.0.0.1:8000/api/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log("API response:", response.data); // Log the API response

        const { data } = response;
        console.log(data)

        getCurrentUser({
          userId: profile && data.id,
          user: {
            ...profile,
            uid: data.id,
            name: data.name,
            email: data.email,
            imageUrl: data.imageUrl, 
          },
          isLoading: false,
          isLoaded: true,
        });
      })
      .catch(error => {
        console.error('Token validation failed:', error);

        localStorage.removeItem('token');
        getCurrentUser({ isLoaded: true, isLoading: false });
        getUserProfile(null);

        // navigate('/login');
      });
    } else {
      console.log("No token found.");
      getCurrentUser({ isLoaded: true, isLoading: false });
      getUserProfile(null);

      // navigate('/login');
    }
  }, [getCurrentUser, profile, getUserProfile]);
};

export const useLogin = () => {
  // const [notify] = useNotification();
  const navigate = useNavigate();
  const { getCurrentUser, getUserProfile } = useCurrentUser(); // Get state management functions

  const { mutate: login, isPending: isSubmitting, isSuccess: isSubmitted } = useMutation({
    mutationFn: async (values) => {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/v1/login', values);

        if (res.data.success) {
          // Store the token and set axios default header
          const token = res.data.data.token;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Update user state
          getCurrentUser({
            userId: res.data.data.id,
            user: {
              uid: res.data.data.id,
              name: res.data.data.name,
              email: res.data.data.email,
              imageUrl: res.data.data.imageUrl,
            },
            isLoading: false,
            isLoaded: true,
          });

          toast.success('logged in successfully');
          navigate(location?.state ? location?.state : "/");
        } else {
          toast.error('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'An error occurred during login');
      }
    }
  });

  return { isSubmitting, isSubmitted, login };
};

export const useRegister = () => {
  const [notify] = useNotification();

  const {
    mutate: register,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      try {
        const authResp = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        await updateProfile(auth.currentUser, {
          displayName: values.name,
        });

        await fbSetDoc({
          collection: "users",
          id: authResp.user?.uid,
          data: {
            email: authResp.user.email,
            name: values.name,
            prefs: {},
          },
        });
        toast.success('User registered successfully');
      } catch (err) {
        console.error("error", err?.code);

        notify({
          title: "Error",
          variant: "error",
          description: err?.code || JSON.stringify(err),
        });
      }
    },
  });

  return { isSubmitting, isSubmitted, register };
};

export const useSocialAuthSignUp = () => {
  const [notify] = useNotification();

  const {
    mutate: socialAuthSignUp,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (strategy) => {
      try {
        if (strategy === "oauth_google") {
          await signInWithRedirect(auth, googleProvider);
          toast.success('Redirecting to Google for authentication...');
        }
        if (strategy === "oauth_github") {
          await signInWithRedirect(auth, githubProvider);
          toast.success('Redirecting to GitHub for authentication...');
        }
      } catch (err) {
        console.error("error", err, err?.code);
        notify({
          title: "Error",
          variant: "error",
          description: err?.code || JSON.stringify(err),
        });
      }
    },
  });

  return { isSubmitting, isSubmitted, socialAuthSignUp };
};

export const useSocialAuthSignUpRedirect = () => {
  const {
    mutate: socialAuthSignUpRedirect,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async () => {
      try {
        const result = await getRedirectResult(auth);

        const user = result?.user;

        if (user && result) {
          const name = user?.displayName.split(" ")[0];

          await updateProfile(auth.currentUser, {
            displayName: name,
          });

          await fbSetDoc({
            collection: "users",
            id: user?.uid,
            data: {
              email: user.email,
              name: name,
              photoURL: user.photoURL,
              prefs: {},
            },
          });
        }
      } catch (err) {
        console.error("error", err, err?.code);
      }
    },
  });

  return { isSubmitting, isSubmitted, socialAuthSignUpRedirect };
};

export const useLogout = () => {
  const { getCurrentUser } = useCurrentUser();

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          // Clear user data and remove token from localStorage
          getCurrentUser({ isLoaded: true, isLoading: false });
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          toast.success('Logout successful');
          console.log('Logout successful');
          navigate('/login'); // Redirect to login page
        } else {
          console.error('Logout failed');
          toast.error('Logout failed');
          toast.error('An error occurred during logout');
        }
      }
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
    }
  };

  return { logout };
};


export const useForgetPassCreate = () => {
  const [notify] = useNotification();

  const {
    mutate: forgetPassCreate,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      try {
        const actionCodeSettings = {
          url: import.meta.env.VITE_PUBLIC_AUTH_RESET_PASS_ACTION_URL,
          handleCodeInApp: false,
        };

        await sendPasswordResetEmail(auth, values?.email, actionCodeSettings);

        notify({
          title: "Success",
          variant: "success",
          description: "Password reset email sent",
        });

        return null;
      } catch (error) {
        // console.log(error, "ERROR");
        const message =
          error.code === "auth/user-not-found"
            ? "Email address not found. Check your email address and try again."
            : "An error occured. Try again later.";
        notify({
          title: "Error",
          variant: "error",
          description: message,
        });
      }
    },
  });

  return {
    forgetPassCreate,
    isSubmitting,
    isSubmitted,
  };
};

export const useVerifyResetPassword = (actionCode) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["resetPassword", { actionCode }],
    queryFn: async () => {
      if (actionCode) {
        try {
          return await verifyPasswordResetCode(auth, actionCode);
        } catch (error) {
          // console.log(error.code);
        }
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useForgetPassReset = () => {
  const [notify] = useNotification();

  const navigate = useNavigate();

  const {
    mutate: forgetPassReset,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      try {
        await confirmPasswordReset(auth, values?.actionCode, values?.password);

        notify({
          title: "Success",
          variant: "success",
          description: "Password reset successful",
        });
      } catch (error) {
        let message;
        if (error?.code) {
          switch (error?.code) {
            case "auth/invalid-action-code":
              message = "Reset Code has Expired";
              break;

            default:
              message = "An error occured. Try again later.";
              break;
          }
        } else {
          message = "An error occured. Try again later.";
        }

        notify({
          title: "Error",
          variant: "error",
          description: message,
        });
      }
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  return {
    forgetPassReset,
    isSubmitting,
    isSubmitted,
  };
};
