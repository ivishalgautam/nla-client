"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { GrAddCircle } from "react-icons/gr";

const Question = ({ questionStates, setQuestionStates }) => {
  const handleQuestionInputChange = (e, index) => {
    const { name, value } = e.target;

    setQuestionStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = {
        ...updatedStates[index],
        values: {
          ...updatedStates[index].values,
          [name]: value,
        },
      };
      return updatedStates;
    });
  };

  const handleAnswerInputChange = (e, index) => {
    const { value } = e.target;
    setQuestionStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = {
        ...updatedStates[index],
        answer: value,
      };
      return updatedStates;
    });
  };

  const handleAddQuestion = () => {
    if (questionStates.length >= 100)
      return toast.error("You can not add more than 100 questions!");

    setQuestionStates((prevStates) => [
      ...prevStates,
      {
        values: {
          value1: "",
          value2: "",
          value3: "",
          value4: "",
          value5: "",
        },
        answer: "",
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    setQuestionStates((prev) => prev.filter((item, ind) => ind !== index));
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      {questionStates.map((questionState, index) => (
        <div key={index} className="question-box">
          <div className="flex justify-between items-center">
            <p className="">{`Question No. - ${index + 1}`}</p>
            <button
              type="button"
              className="bg-rose-500 p-2 rounded"
              onClick={() => handleDeleteQuestion(index)}
            >
              <AiOutlineDelete className="text-white" />
            </button>
          </div>
          {Object.keys(questionState.values).map((key) => (
            <div className="inputGroup" key={key}>
              <input
                name={key}
                value={questionState.values[key]}
                onChange={(e) => handleQuestionInputChange(e, index)}
                type="text"
                required=""
                autocomplete="off"
              />
              <label htmlFor={key}>Value</label>
            </div>
          ))}
          <hr />
          <div className="inputGroup mb-0">
            <input
              type="text"
              id={`answer${index}`}
              name={`answer${index}`}
              value={questionState.answer}
              className=""
              placeholder=""
              autoComplete="off"
              onChange={(e) => handleAnswerInputChange(e, index)}
            />
            <label htmlFor={`answer${index}`}>Answer</label>
          </div>
        </div>
      ))}
      <div
        className="flex items-center justify-center add-question cursor-pointer"
        onClick={() => handleAddQuestion()}
      >
        <button type="button">
          <GrAddCircle size={50} />
        </button>
        <h4>Add Question</h4>
      </div>
    </div>
  );
};

export default Question;
