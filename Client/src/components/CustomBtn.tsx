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
      className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-black/70"
    >
      {text}
    </button>
  );
};

export default CustomBtn;
