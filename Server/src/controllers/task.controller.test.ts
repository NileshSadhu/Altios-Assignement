import { jest } from "@jest/globals";
import type { Request, Response } from "express";

const mockTaskFind = jest.fn<() => Promise<any>>();
const mockTaskFindOne = jest.fn<() => Promise<any>>();
const mockTaskCreate = jest.fn<() => Promise<any>>();
const mockTaskFindOneAndUpdate = jest.fn<() => Promise<any>>();
const mockTaskFindOneAndDelete = jest.fn<() => Promise<any>>();

jest.unstable_mockModule("../models/task.model.js", () => ({
  Task: {
    find: mockTaskFind,
    findOne: mockTaskFindOne,
    create: mockTaskCreate,
    findOneAndUpdate: mockTaskFindOneAndUpdate,
    findOneAndDelete: mockTaskFindOneAndDelete,
  },
}));

const { getTask, getTaskById, addTask, updateTask, deleteTask } =
  await import("./task.controller.js");

function createMockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as any;
  res.json = jest.fn().mockReturnValue(res) as any;
  return res;
}

function createMockRequest(overrides: Partial<Request> = {}) {
  return {
    body: {},
    params: {},
    query: {},
    userId: "user123",
    ...overrides,
  } as unknown as Request;
}

describe("getTask controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with all tasks for the current user", async () => {
    const mockTasks = [
      { _id: "t1", title: "Task 1", userId: "user123" },
      { _id: "t2", title: "Task 2", userId: "user123" },
    ];

    mockTaskFind.mockResolvedValue(mockTasks as any);

    const req = createMockRequest();
    const res = createMockResponse();

    await getTask(req, res);

    expect(mockTaskFind).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ tasks: mockTasks });
  });

  it("filters by status when a status query param is provided", async () => {
    const mockTasks = [{ _id: "t1", title: "Task 1", status: "pending" }];

    mockTaskFind.mockResolvedValue(mockTasks as any);

    const req = createMockRequest({ query: { status: "pending" } });
    const res = createMockResponse();

    await getTask(req, res);

    expect(mockTaskFind).toHaveBeenCalledWith({
      userId: "user123",
      status: "pending",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 500 when the database call fails", async () => {
    mockTaskFind.mockRejectedValue(new Error("DB error"));

    const req = createMockRequest();
    const res = createMockResponse();

    await getTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server side error." });
  });
});

describe("getTaskById controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with the task when found", async () => {
    const mockTask = { _id: "t1", title: "Task 1", userId: "user123" };

    mockTaskFindOne.mockResolvedValue(mockTask as any);

    const req = createMockRequest({ params: { id: "t1" } });
    const res = createMockResponse();

    await getTaskById(req, res);

    expect(mockTaskFindOne).toHaveBeenCalledWith({
      _id: "t1",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task: mockTask });
  });

  it("returns 404 when the task does not exist", async () => {
    mockTaskFindOne.mockResolvedValue(null);

    const req = createMockRequest({ params: { id: "nonexistent" } });
    const res = createMockResponse();

    await getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
  });

  it("returns 400 when id param is missing", async () => {
    const req = createMockRequest({ params: {} });
    const res = createMockResponse();

    await getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Task id is required" });
    expect(mockTaskFindOne).not.toHaveBeenCalled();
  });
});

describe("addTask controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 201 and creates a task with valid input", async () => {
    const mockCreatedTask = {
      _id: "t1",
      title: "New Task",
      priority: "high",
      userId: "user123",
    };

    mockTaskCreate.mockResolvedValue(mockCreatedTask as any);

    const req = createMockRequest({
      body: { title: "New Task", priority: "high" },
    });
    const res = createMockResponse();

    await addTask(req, res);

    expect(mockTaskCreate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "New Task", userId: "user123" }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Task created successfully.",
        task: mockCreatedTask,
      }),
    );
  });

  it("returns 400 when title is missing (Zod validation failure)", async () => {
    const req = createMockRequest({ body: { priority: "high" } });
    const res = createMockResponse();

    await addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Zod validation Error." }),
    );
    expect(mockTaskCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when title is shorter than the minimum length", async () => {
    const req = createMockRequest({ body: { title: "ab" } });
    const res = createMockResponse();

    await addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockTaskCreate).not.toHaveBeenCalled();
  });

  it("returns 500 when task creation throws an unexpected error", async () => {
    mockTaskCreate.mockRejectedValue(new Error("DB error"));

    const req = createMockRequest({ body: { title: "New Task" } });
    const res = createMockResponse();

    await addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server side error." });
  });
});

describe("updateTask controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and the updated task on success", async () => {
    const mockUpdatedTask = {
      _id: "t1",
      title: "Updated Task",
      status: "completed",
    };

    mockTaskFindOneAndUpdate.mockResolvedValue(mockUpdatedTask as any);

    const req = createMockRequest({
      params: { id: "t1" },
      body: { title: "Updated Task", status: "completed" },
    });
    const res = createMockResponse();

    await updateTask(req, res);

    expect(mockTaskFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: "t1", userId: "user123" },
      expect.objectContaining({ title: "Updated Task" }),
      { returnDocument: "after" },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ task: mockUpdatedTask }),
    );
  });

  it("returns 404 when the task to update is not found", async () => {
    mockTaskFindOneAndUpdate.mockResolvedValue(null);

    const req = createMockRequest({
      params: { id: "nonexistent" },
      body: { title: "Updated Task" },
    });
    const res = createMockResponse();

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
  });
});

describe("deleteTask controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 when the task is deleted successfully", async () => {
    const mockDeletedTask = { _id: "t1", title: "Task to delete" };

    mockTaskFindOneAndDelete.mockResolvedValue(mockDeletedTask as any);

    const req = createMockRequest({ params: { id: "t1" } });
    const res = createMockResponse();

    await deleteTask(req, res);

    expect(mockTaskFindOneAndDelete).toHaveBeenCalledWith({
      _id: "t1",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task deleted successfully.",
    });
  });

  it("returns 404 when the task to delete does not exist", async () => {
    mockTaskFindOneAndDelete.mockResolvedValue(null);

    const req = createMockRequest({ params: { id: "nonexistent" } });
    const res = createMockResponse();

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
  });

  it("returns 400 when id param is missing", async () => {
    const req = createMockRequest({ params: {} });
    const res = createMockResponse();

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockTaskFindOneAndDelete).not.toHaveBeenCalled();
  });
});
