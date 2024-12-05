import axios from 'axios'
import { AuthModel, UserModel, PaginatedStory, StoryDetails } from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/auth/activate-account`
export const LOGIN_URL = `${API_URL}/auth/authenticate` // Update the login URL
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`
export const STORIES_URL = `${API_URL}/stories`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  })
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  })
}

// Pass the token in the headers for the API call
export function getUserByToken(token: string) {
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
    params: {
      token: '762902',
    },
  })
}

// Pass the token in the headers for the API call
export function getStories(token: string, page: number, size: number = 9, filters?: { language?: string; level?: string; age?: string, searchKeywords?: string }) {
  return axios.get<PaginatedStory>(STORIES_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
    params: {
      page,
      size,
      ...filters,
    },
  })
}

export function getStoryDetails(storyId: number, token: string) {
  return axios.get<StoryDetails>(`${STORIES_URL}/${storyId}/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}