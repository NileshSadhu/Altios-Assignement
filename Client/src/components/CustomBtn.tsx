interface CustomBtnProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const CustomBtn = ({ text, onClick, type = "button" }: CustomBtnProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
    >
      {text}
    </button>
  );
};

export default CustomBtn;
