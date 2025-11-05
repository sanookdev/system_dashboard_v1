import axios from "axios";

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
    return data?.urlImg?.url ?? null;
  } catch (e) {
    console.error("fetchAvatarUrl error:", e);
    return null;
  }
}
