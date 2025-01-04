"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

interface CreateTaskData {
  title: string;
  description: string;
  icon: string;
}

interface UpdateData {
  title?: string;
  description?: string | null;
  icon?: string | null;
}

export async function createTask(data: CreateTaskData, userId: string) {
  const title = data.title?.trim();
  const description = data.description?.trim();
  const icon = data.icon;

  if (!title) return;

  try {
    await prisma.task.create({
      data: {
        title,
        description: description || null,
        icon: icon || null,
        userId,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
}

// Update task status (completed or not)
export async function updateTask(formData: FormData) {
  const inputId = formData.get("inputId") as string;

  // Find the task by its ID
  const task = await prisma.task.findUnique({
    where: {
      id: inputId,
    },
  });

  if (!task) {
    console.error("Task not found");
    return;
  }

  // Toggle
  const updatedTaskStatus = !task.isCompleted;

  // Sends a query to the database to update the task's status
  await prisma.task.update({
    where: {
      id: inputId,
    },
    data: {
      isCompleted: updatedTaskStatus,
    },
  });

  // Revalidate the home page after submission
  revalidatePath("/");

  return updatedTaskStatus;
}

// Edit task
export async function editTask(formData: FormData) {
  const inputId = formData.get("inputId") as string;
  const inputTitle = formData.get("newTitle") as string;
  const inputIcon = formData.get("newIcon") as string;

  const updateData: UpdateData = {};
  
  // Only include fields that are present in the formData
  if (inputTitle) updateData.title = inputTitle;
  if (inputIcon) updateData.icon = inputIcon;

  // Sends a query to the database to update the task
  await prisma.task.update({
    where: {
      id: inputId,
    },
    data: updateData,
  });

  // Revalidate the home page after submission
  revalidatePath("/");
}

// Delete task
export async function deleteTask(formData: FormData) {
  const inputId = formData.get("inputId") as string;

  // Sends a query to the database to delete the task with the provided ID
  await prisma.task.delete({
    where: {
      id: inputId,
    },
  });

  // Revalidate the home page after submission
  revalidatePath("/");
}

// Update task description
export async function updateTaskDescription(formData: FormData) {
  const inputId = formData.get("inputId") as string;
  const description = formData.get("description") as string;

  await prisma.task.update({
    where: {
      id: inputId,
    },
    data: {
      description: description || null,
    },
  });

  revalidatePath("/");
}

// Update task icon
export async function updateTaskIcon(formData: FormData) {
  const inputId = formData.get("inputId") as string;
  const icon = formData.get("icon") as string;

  await prisma.task.update({
    where: {
      id: inputId,
    },
    data: {
      icon: icon || null,
    },
  });

  revalidatePath("/");
}

// GET user preferences regarding the completion modal
export async function getUserCompletionPreference(formData: FormData) {
  const userId = formData.get("userId") as string;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      hideCompletionModal: true,
      completionPreference: true,
    },
  });

  return {
    hideCompletionModal: user?.hideCompletionModal || false,
    completionPreference: user?.completionPreference || 'ask'
  };
}

// Function to update user preferences regarding the completion modal
export async function updateUserCompletionPreference(formData: FormData) {
  const userId = formData.get("userId") as string;
  const hideModal = formData.get("hideCompletionModal") === "true";
  const preference = formData.get("completionPreference") as string;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hideCompletionModal: hideModal,
      completionPreference: preference,
    },
  });

  revalidatePath("/");
}

// Complete and Delete task in one go
export async function completeAndDeleteTask(formData: FormData) {
  const inputId = formData.get("inputId") as string;
  
  try {
    // First mark as completed
    await prisma.task.update({
      where: {
        id: inputId,
      },
      data: {
        isCompleted: true,
      },
    });

    // Then delete the task
    await prisma.task.delete({
      where: {
        id: inputId,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error completing and deleting task:", error);
    throw new Error("Failed to complete and delete task");
  }
}

// Reset completion modal preference (show modal CompletionConfirmModal again)
export async function resetCompletionModalPreference(formData: FormData) {
  const userId = formData.get("userId") as string;
  
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hideCompletionModal: false,
        completionPreference: 'ask',
      },
    });

    // Single revalidation is enough since we have the correct data
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error("Error resetting completion preferences:", error);
    throw new Error("Failed to reset completion preferences");
  }
}