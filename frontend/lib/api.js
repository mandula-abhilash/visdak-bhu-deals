const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const landAPI = {
  async getAll(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/lands${queryParams ? '?' + queryParams : ''}`;
    const response = await fetch(url);
    return await response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/lands/${id}`);
    return await response.json();
  },

  async getFullDetails(id) {
    const response = await fetch(`${API_BASE_URL}/lands/${id}/full`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  },

  async searchByRadius(lat, lng, radius) {
    const response = await fetch(
      `${API_BASE_URL}/lands/search/radius?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    return await response.json();
  },

  async create(landData) {
    const response = await fetch(`${API_BASE_URL}/lands`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(landData),
    });
    return await response.json();
  },

  async update(id, landData) {
    const response = await fetch(`${API_BASE_URL}/lands/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(landData),
    });
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/lands/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await response.json();
  },
};

export const uploadAPI = {
  async uploadPhotos(landId, files) {
    const formData = new FormData();
    formData.append('land_id', landId.toString());

    for (let file of files) {
      formData.append('photos', file);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE_URL}/upload/photos`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return await response.json();
  },

  async uploadDocuments(landId, files) {
    const formData = new FormData();
    formData.append('land_id', landId.toString());

    for (let file of files) {
      formData.append('documents', file);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE_URL}/upload/documents`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return await response.json();
  },
};

export const paymentAPI = {
  async createSubscriptionOrder(planType) {
    const response = await fetch(`${API_BASE_URL}/payment/create-subscription`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ plan_type: planType }),
    });
    return await response.json();
  },

  async createSitePurchaseOrder(landId) {
    const response = await fetch(`${API_BASE_URL}/payment/create-site-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ land_id: landId }),
    });
    return await response.json();
  },

  async verifyPayment(paymentData) {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return await response.json();
  },

  async checkLandAccess(landId) {
    const response = await fetch(`${API_BASE_URL}/payment/access/${landId}`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  },
};
