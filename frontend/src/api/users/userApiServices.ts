import axios from "axios";
import AXIOS_INSTANCE from "@/api/axios_instance";
import { UserSignup } from "@/types/user";

export const _on_login =
  async (user: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/users/login",
        user
      );
      return response.data;
    } catch (error: any) {

      return error;
    }
  };

export const on_signup = async (user: UserSignup) => {
  try {

    const response = await axios.post("http://127.0.0.1:8080/users", user);
    return response.data;
  } catch (error: any) {

    return error;
  }
};

export const on_logout = async () => {
  const sessionStorage = window.sessionStorage.getItem("token");
  if (sessionStorage) {
    window.sessionStorage.removeItem("token");

  }
};

export const _get_user_profile_data = async () => {
  try {
    AXIOS_INSTANCE.get("/users/profile")
      .then((data) => {
        console.log("user_profile_data", data);
        return data?.data;
      })
      .catch((error) => {
        return error;
      });
  } catch (error: any) {
    return error;
  }
};
export const _get_user_profile_data1 = async () => {
  try {
    const response = await AXIOS_INSTANCE.get("/users/profile");
    return response?.data
  } catch (error) {
    return error;
  }
};


export const get_users = async ({
  page,
  perPage,
  searchText,
  startDate,
  endDate
}: {
  page?: number;
  perPage?: number;
  searchText?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    // Build query parameters object
    const params: Record<string, string> = {};

    if (page !== undefined) params['page'] = page.toString();
    if (perPage !== undefined) params['per_page'] = perPage.toString();
    if (searchText) params['search'] = searchText;
    if (startDate) params['start_date'] = startDate;
    if (endDate) params['end_date'] = endDate;

    return AXIOS_INSTANCE.get('/get_users', { params })
      .then((response) => {
        console.log(response.data, "data from inside");
        return response.data;
      })
      .catch((error) => {
        // It's better to throw the error so it can be caught by the caller
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
