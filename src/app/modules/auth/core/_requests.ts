import axios from 'axios'
import { AuthModel, UserModel, PaginatedStory, StoryDetails } from './_models'

const API_URL = process.env.REACT_APP_API_URL || 'http://10.10.20.16:8088/api/v1';

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/auth/activate-account`
export const LOGIN_URL = `${API_URL}/auth/authenticate` // Update the login URL
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`
export const STORIES_URL = `${API_URL}/stories`
export const STORIES_OWNER_URL = `${API_URL}/stories/owner`

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

export function deleteStoryById(storyId: number, token: string) {
  return axios.delete(`${STORIES_URL}/${storyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function rateStoryById(storyId: number, rating: number, token: string) {
  return axios.put(
    `${STORIES_URL}/${storyId}/rate`, // Προσαρμογή της διαδρομής αν χρειάζεται
    { rating }, // Στέλνουμε το rating στο request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
}

// Pass the token in the headers for the API call
export function getStoriesByOwner(token: string, page: number, size: number = 3) {
  return axios.get<PaginatedStory>(STORIES_OWNER_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
    params: {
      page,
      size,
    },
  })
}