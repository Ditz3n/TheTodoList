import { AddTask } from "../../components/shared/AddTask";
import { prisma } from "../../utils/prisma";
import { Task } from "../../components/shared/Task";

// This function is used to get the tasks from the database and order them by the date they were created descending.
async function getTasks() {
  const tasks = await prisma.tasks.findMany({
    select: {
      id: true,
      title: true,
      isCompleted: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  });
  
  return tasks;
}

const Home = async() => {

  // Get the tasks from the database
  const tasks = await getTasks();

  return (
    <div className="w-screen py-20 flex justify-center flex-col items-center">
      <span className="text-3xl font-extrabold uppercase">
        Clarity
      </span>
      <h1 className="text-2xl font-bold uppercase mb-5">
        Next.js 15.1.2 + TypeScript 4.5.4 + Tailwind CSS 3.0.10
      </h1>
      <div className="fkex flex-col justify-center items-center w-auto">
        <AddTask />
      </div>
      <div className="flex flex-col gap-5 mt-10 justify-center items-center w-full">
        {tasks.map((task, id) => (
          <div key={id} className="flex justify-between items-center w-1/2">
            <Task task={task}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;