import axios from "axios";
import api from "@/utils/api";

export async function fetchAvatarUrl(username) {
  try {
    console.log("username = " + username);
    const { data } = await axios.get(
      `https://med.tu.ac.th/emp_api/api/employee/profileImg/username/${encodeURIComponent(
        username
      )}`,
      {
        headers: {
          "Application-Key": import.meta.env.VITE_APPLICATION_KEY_AVATAR,
        },
      }
    );
    console.log(data);
    const imgUrl = data?.urlImg?.url ?? null;
    if (!imgUrl) return null;

    // proxy ผ่าน backend เพื่อเลี่ยงปัญหา CORS/Private Network Access
    return `${api.defaults.baseURL}auth/avatar-image?url=${encodeURIComponent(
      imgUrl
    )}`;
  } catch (e) {
    console.error("fetchAvatarUrl error:", e);
    return null;
  }
}
