import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import Input from "../components/Input.jsx";
import { motion } from "framer-motion";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            name="fullName"
            onChange={handleChange}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={formData.email}
            name="email"
            onChange={handleChange}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <PasswordStrengthMeter password={formData.password} />
        </form>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
