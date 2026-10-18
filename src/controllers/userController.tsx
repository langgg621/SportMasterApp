import { MOCK_USER_PROFILE } from '../data/mockData';
import { User } from '../models/user';

let currentUserProfile: User = { ...MOCK_USER_PROFILE };

export const userController = {
  // Lấy thông tin profile người dùng
  getUserProfile(): User {
    return currentUserProfile;
  },

  // Cập nhật thông tin profile
  updateUserProfile(updatedData: Partial<User>): User {
    currentUserProfile = {
      ...currentUserProfile,
      ...updatedData,
    };
    return currentUserProfile;
  },

  // Cập nhật điểm thưởng hoặc vị trí địa lý
  updateLocation(newLocation: string): void {
    currentUserProfile.location = newLocation;
  },
};