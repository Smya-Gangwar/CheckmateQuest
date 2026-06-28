import { useEffect, useState, } from "react";

const QuestionModal = ({isOpen, data, onClose, onSubmit,}) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  if(!isOpen || !data || data.type !== "QUESTION") {
    return null;
  }
  useEffect(() => {setSelectedAnswer("");}, [data]);
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-2xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Question
          </h1>
          <button onClick={onClose} className="text-red-400 text-xl">
            ✕
          </button>
        </div>
        <div className="mb-6">
          {
            data.question.image_url && (
              <img src={data.question.image_url} alt="Question" className="w-full max-h-72 object-contain rounded-lg mb-4"/>
            )
          }
          <p className="text-xl">
            {data.question.content}
          </p>
        </div>

        {/* MCQ */}
        {data.question.question_type === "MCQ" && (
          <div className="space-y-3">
            {data.question.options.map((option, index) => (
                <button key={index} onClick={() => setSelectedAnswer(option)} 
                  className={`w-full p-3 rounded-lg text-left transition
                    ${ selectedAnswer === option ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                  {option}
                </button>
              )
            )}
          </div>
        )}

        {/* ONE WORD */}
        {data.question.question_type === "ONE_WORD" && (
          <input type="text"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            placeholder="Enter answer..."
            className="w-full bg-gray-700 p-3 rounded-lg outline-none"
          />
        )}

        <button onClick={() => onSubmit(selectedAnswer)}
            disabled={!selectedAnswer}
            className="mt-8 w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 p-3 rounded-lg font-bold">
            Submit Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionModal;