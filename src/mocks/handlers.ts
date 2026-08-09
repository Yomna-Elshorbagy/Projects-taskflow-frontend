import { http, HttpResponse } from 'msw';
import { baseURL } from '../Constants/BaseUrl';

export const handlers = [
  http.post(`${baseURL}/auth/login`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        message: 'Login successful',
        accessToken: 'fake-jwt-token',
        data: {
          id: '507f1f77bcf86cd799439011',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        }
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials. Please try again.' },
      { status: 401 }
    );
  }),

  http.post(`${baseURL}/auth/signup`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { message: 'Email already exists.' },
        { status: 409 }
      );
    }

    return HttpResponse.json({
      message: 'Welcome to TaskFlow 🎉',
      accessToken: 'fake-jwt-token',
      data: {
        id: '2',
        userName: body.userName,
        email: body.email,
        role: 'member',
      }
    });
  }),

  http.get(`${baseURL}/auth/profile`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        _id: '507f1f77bcf86cd799439011',
        userName: 'Test User',
        email: 'test@example.com',
        mobileNumber: '01000000000',
        address: 'Cairo, Egypt',
        gender: 'male',
        role: 'member',
        status: 'online',
        isVerified: true
      }
    });
  }),

  http.put(`${baseURL}/auth/profile`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    
    return HttpResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: '507f1f77bcf86cd799439011',
        userName: body.userName || 'Test User',
        email: 'test@example.com', // Read-only
        mobileNumber: body.mobileNumber || '01000000000',
        address: body.address || 'Cairo, Egypt',
        gender: body.gender || 'male',
        role: 'user',
        status: 'online',
        isVerified: true
      }
    });
  }),

  http.get(`${baseURL}/projects`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: 'proj1',
          name: 'Test Project',
          description: 'A mock project',
          status: 'Active',
          creator: { _id: '507f1f77bcf86cd799439011', userName: 'Test User' },
          members: [
            { _id: '507f1f77bcf86cd799439011', userName: 'Test User' }
          ]
        }
      ],
      pagination: {
        total: 1,
        page: 1,
        pages: 1,
      }
    });
  }),

  http.post(`${baseURL}/projects`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      message: 'Project created successfully',
      data: {
        _id: 'proj2',
        name: body.name,
        description: body.description,
        status: 'Active',
        creator: { _id: '507f1f77bcf86cd799439011', userName: 'Test User' },
        members: []
      }
    });
  }),

  http.get(`${baseURL}/projects/:projectId`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        _id: 'proj1',
        name: 'Test Project',
        description: 'A mock project',
        status: 'Active',
        creator: { _id: '507f1f77bcf86cd799439011', userName: 'Test User' },
        members: [
          { _id: '507f1f77bcf86cd799439011', userName: 'Test User' }
        ]
      }
    });
  }),

  http.get(`${baseURL}/projects/:projectId/tasks`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: 'task1',
          title: 'Test Task',
          description: 'Mock task description',
          status: 'To Do',
          priority: 'High',
          project: 'proj1',
          assignee: { _id: '507f1f77bcf86cd799439011', userName: 'Test User' },
          dueDate: new Date().toISOString(),
        }
      ],
      pagination: {
        total: 1,
        page: 1,
        pages: 1,
      }
    });
  }),

  http.post(`${baseURL}/projects/:projectId/tasks`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      message: 'Task created successfully',
      data: {
        _id: 'task2',
        title: body.title,
        description: body.description,
        status: body.status || 'To Do',
        priority: body.priority || 'Medium',
      }
    });
  }),
];
