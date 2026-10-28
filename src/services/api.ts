import { User, Room, Booking, Review, AdminStats } from '../types/index.js';

const API_BASE = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('hotelpro_token');
  }

  public setToken(token: string) {
    localStorage.setItem('hotelpro_token', token);
  }

  public removeToken() {
    localStorage.removeItem('hotelpro_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  }

  // Auth APIs
  async register(body: { name: string; email: string; phone?: string; password: string }) {
    const res = await this.request<{ success: boolean; token: string; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async login(body: { email: string; password: string }) {
    const res = await this.request<{ success: boolean; token: string; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async logout() {
    try {
      await this.request<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } finally {
      this.removeToken();
    }
  }

  async getMe() {
    return this.request<{ success: boolean; user: User }>('/auth/me');
  }

  async updateProfile(body: { name?: string; phone?: string; profileImage?: string }) {
    return this.request<{ success: boolean; user: User; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  async changePassword(body: { currentPassword: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string; demoResetToken?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(body: { token: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Room APIs
  async getRooms(params: Record<string, string | number | undefined> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{
      success: boolean;
      rooms: Room[];
      total: number;
      totalPages: number;
      count: number;
      page: number;
    }>(`/rooms${qs}`);
  }

  async getRoomById(id: string) {
    return this.request<{ success: boolean; room: Room; reviews: Review[] }>(`/rooms/${id}`);
  }

  async checkAvailability(roomId: string, checkIn: string, checkOut: string) {
    return this.request<{ success: boolean; available: boolean }>(
      `/rooms/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  }

  async createRoom(body: Partial<Room>) {
    return this.request<{ success: boolean; room: Room; message: string }>('/rooms', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async updateRoom(id: string, body: Partial<Room>) {
    return this.request<{ success: boolean; room: Room; message: string }>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  async deleteRoom(id: string) {
    return this.request<{ success: boolean; message: string }>(`/rooms/${id}`, {
      method: 'DELETE'
    });
  }

  // Booking APIs
  async createBooking(body: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    numberOfGuests: number;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    specialRequests?: string;
  }) {
    return this.request<{ success: boolean; booking: Booking; message: string }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async getMyBookings() {
    return this.request<{ success: boolean; bookings: Booking[]; count: number }>('/bookings/my-bookings');
  }

  async getBookingById(id: string) {
    return this.request<{ success: boolean; booking: Booking & { payments?: any[] } }>(`/bookings/${id}`);
  }

  async cancelBooking(id: string, cancellationReason: string) {
    return this.request<{ success: boolean; booking: Booking; message: string }>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ cancellationReason })
    });
  }

  async updateBookingStatus(id: string, updates: { bookingStatus?: string; paymentStatus?: string }) {
    return this.request<{ success: boolean; booking: Booking; message: string }>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Payment APIs
  async createPaymentOrder(bookingId: string, provider: 'razorpay' | 'card_simulator' = 'razorpay') {
    return this.request<{
      success: boolean;
      order: {
        id: string;
        amount: number;
        totalAmount: number;
        currency: string;
        provider: string;
        key: string;
        bookingReference: string;
      };
    }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingId, provider })
    });
  }

  async verifyPayment(body: {
    bookingId: string;
    provider?: string;
    providerOrderId: string;
    providerPaymentId?: string;
    providerSignature?: string;
  }) {
    return this.request<{ success: boolean; message: string; booking: Booking }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Admin APIs
  async getAdminStats() {
    return this.request<{ success: boolean; stats: AdminStats }>('/admin/dashboard');
  }

  async getAllUsers() {
    return this.request<{ success: boolean; users: User[] }>('/admin/users');
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<{ success: boolean; message: string }>('/admin/users/' + userId + '/role', {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  }

  async getAllBookings(params: { status?: string; search?: string } = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ success: boolean; bookings: Booking[] }>(`/admin/bookings${qs}`);
  }

  async getStaffOperations() {
    return this.request<{
      success: boolean;
      today: string;
      arrivals: Booking[];
      departures: Booking[];
      inHouseCount: number;
      rooms: Room[];
    }>('/admin/operations');
  }

  async resetDemoData() {
    return this.request<{ success: boolean; message: string }>('/admin/reset-demo', {
      method: 'POST'
    });
  }

  // Review APIs
  async createReview(body: { roomId: string; bookingId: string; rating: number; comment: string }) {
    return this.request<{ success: boolean; review: Review; message: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async getRoomReviews(roomId: string) {
    return this.request<{ success: boolean; reviews: Review[] }>(`/reviews/room/${roomId}`);
  }
}

export const api = new ApiService();
