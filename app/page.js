"use client";
import { useCallback, useState } from "react";
import { BeatLoader } from "react-spinners";
import { superagent } from "@/lib/superagent";
import { useForm } from "react-hook-form";

export default function Home() {
  const [message, setMessage] = useState();
  const [aiResponse, setAiResponse] = useState();
  const [conversation, setConversation] = useState([]);
  const {
    formState: { isSubmitting, error },
    handleSubmit,
    register,
  } = useForm();

  const onSubmit = useCallback(async (values) => {
    const { message } = values;
    const newMessage = { type: 'user', content: message };
    setConversation([newMessage, ...conversation]);

    setMessage(message);
    setAiResponse();

    const { data } = await superagent.agents().predict({
      id: process.env.NEXT_PUBLIC_AGENT_ID,
      input: { input: message },
      has_streaming: false,
    });

    const newResponse = { type: 'ai', content: data };
    setConversation([newResponse, ...conversation]);

    setAiResponse(data);
  }, [conversation]);

  return (
    <main className="flex mx-auto min-h-screen flex-col justify-between p-24 max-w-5xl font-mono">
      <div className="flex flex-col space-y-7">
        <div className="z-10 w-full mx-auto items-start justify-center font-mono text-md lg:flex">
          <p className="flex w-full align-center justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Superagent.sh with NextJS
          </p>
        </div>
        <div className="p-2 items-center bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
          <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
            Demo
          </span>
          <span className="font-semibold mr-2 text-left flex-auto">
            Ask questions about Alphabet Q1 2023 Earnings.
          </span>
        </div>
        <div className="flex flex-col space-y-4">
          {conversation.map((message, index) => (
            <div key={index} className={`flex space-x-2 text-${message.type === 'user' ? 'orange' : 'green'}-500 font-bold text-md`}>
              <div className="flex items-center space-x-2">
                <p className="text-white">
                  <svg className="fill-current opacity-75 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                  </svg>
                </p>
                <p>{message.content}</p>
                {isSubmitting && <BeatLoader color="white" size={6} />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:col-span-4">
          <div className="mt-2 flex justify-between space-x-2">
            <div className="rounded-md flex flex-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
              <input
                disabled={isSubmitting}
                type="text"
                {...register("message", { required: true })}
                className="block w-full border-0 bg-transparent py-1.5 pl-2 text-gray-100 placeholder:text-gray-400 focus:ring-0 sm:text-md sm:leading-6"
                placeholder="Enter your message..."
              />
            </div>
            <button
              disabled={isSubmitting}
              className="bg-indigo-800 font-mono hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-md"
            >
              {isSubmitting ? <BeatLoader color="white" size={8} /> : "Send"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
``
