/**
 * API Client - Functions to call our API routes
 */

import type { Client } from '@/types';

const API_BASE_URL = '/api';

type ErrorResponse = {
  error: string;
  issues?: string[];
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      error: 'An error occurred',
      issues: [],
    }));

    throw new Error(error.error || 'An error occurred');
  }

  return response.json() as Promise<T>;
}

// Projects API
export const projectsApi = {
  /**
   * Fetch all projects with optional filters
   */
  async getAll(filters?: {
    status?: 'planning' | 'active' | 'review' | 'completed' | 'archived';
    clientId?: string;
    priority?: 'low' | 'medium' | 'high';
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.clientId) params.append('clientId', filters.clientId);
    if (filters?.priority) params.append('priority', filters.priority);

    const url = `${API_BASE_URL}/projects${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Fetch single project by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new project
   */
  async create(data: {
    title: string;
    description?: string;
    roadmap?: string;
    buildPlan?: string;
    screenshots?: string[];
    techStack?: string[];
    clientId?: string | null;
    status?: 'planning' | 'active' | 'review' | 'completed' | 'archived';
    priority?: 'low' | 'medium' | 'high';
    progress?: number;
    startDate?: Date | string | null;
    dueDate?: Date | string | null;
    budget?: number | null;
  }) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Update a project
   */
  async update(id: string, data: {
    title?: string;
    description?: string;
    roadmap?: string;
    buildPlan?: string;
    screenshots?: string[];
    techStack?: string[];
    clientId?: string | null;
    status?: 'planning' | 'active' | 'review' | 'completed' | 'archived';
    priority?: 'low' | 'medium' | 'high';
    progress?: number;
    startDate?: Date | string | null;
    dueDate?: Date | string | null;
    budget?: number | null;
  }) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Delete a project
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Clients API
export const clientsApi = {
  /**
   * Fetch all clients
   */
  async getAll(): Promise<Client[]> {
    const response = await fetch(`${API_BASE_URL}/clients`);
    return handleResponse<Client[]>(response);
  },

  /**
   * Fetch single client by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new client
   */
  async create(data: {
    name: string;
    email?: string | null;
    phone?: string | null;
    status?: 'active' | 'inactive' | 'archived';
  }) {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Update a client
   */
  async update(id: string, data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    status?: 'active' | 'inactive' | 'archived';
  }) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Delete a client
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Tasks API
export const tasksApi = {
  /**
   * Fetch all tasks with optional filters
   */
  async getAll(filters?: {
    projectId?: string;
    status?: 'todo' | 'in_progress' | 'review' | 'done';
    priority?: 'low' | 'medium' | 'high';
  }) {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);

    const url = `${API_BASE_URL}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Create a new task
   */
  async create(data: {
    title: string;
    projectId: string;
    status?: 'todo' | 'in_progress' | 'review' | 'done';
    priority?: 'low' | 'medium' | 'high';
    order?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Update a task
   */
  async update(id: string, data: {
    title?: string;
    status?: 'todo' | 'in_progress' | 'review' | 'done';
    priority?: 'low' | 'medium' | 'high';
    order?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Delete a task
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

