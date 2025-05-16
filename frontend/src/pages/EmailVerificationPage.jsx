import { useState } from "react";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useState([]);
  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const splitCode = value.slice(0, 6).slice("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = splitCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((i) => i !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRef.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRef.current[index + 1].focus();
      }
    }
  };
  return <div>EmailVerificationPage</div>;
};

export default EmailVerificationPage;
