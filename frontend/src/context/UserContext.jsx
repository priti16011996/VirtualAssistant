
import React, {
  createContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customFrontendImage, setCustomFrontendImage] = useState("");
  const [customBackendImage, setCustomBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [assistantName, setAssistantName] = useState("");

  const handleCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/v1/api/user/CurrentUser`,
        { withCredentials: true }
      );

      setUserData(response.data.user);
    } catch (error) {
      console.log("Error fetching current user:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    loading,
    customFrontendImage,
    setCustomFrontendImage,
    customBackendImage,
    setCustomBackendImage,
    selectedImage,
    setSelectedImage,
    assistantName,
    setAssistantName
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
