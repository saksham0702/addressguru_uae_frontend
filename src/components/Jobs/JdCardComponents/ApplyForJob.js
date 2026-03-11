import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import InputWithSvg from "@/components/InputWithSvg";
import gsap from "gsap";
import { query } from "@/api/queries";
import ResponseAlert from "@/components/ResponseAlert";

const ApplyForJob = ({ setEnquirePop, highlight, setHighlight, jobId }) => {
  const type = "jobs";
  const id = jobId;
  const [res, setRes] = useState(null);
  const [errors, setErrors] = useState({});
  const [jobQuery, setJobQuery] = useState({
    job_id: jobId,
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    message: "",
  });

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should only contain letters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required";
    if (!/^\d+$/.test(phone)) return "Phone number should only contain digits";
    if (phone.length < 10) return "Phone number must be at least 10 digits";
    if (phone.length > 15) return "Phone number is too long";
    return "";
  };

  const validateExperience = (experience) => {
    if (!experience.trim()) return "Experience is required";
    if (!/^\d+$/.test(experience)) return "Experience should be a number";
    if (parseInt(experience) < 0) return "Experience cannot be negative";
    if (parseInt(experience) > 50)
      return "Please enter valid years of experience";
    return "";
  };

  const validateSkills = (skills) => {
    if (!skills.trim()) return "Skills are required";
    if (skills.trim().length < 3) return "Please add at least one skill";
    return "";
  };

  const validateMessage = (message) => {
    if (!message.trim()) return "Message is required";
    if (message.trim().length < 10)
      return "Message must be at least 10 characters";
    return "";
  };

  // Handle field changes with validation
  const handleFieldChange = (field, value) => {
    setJobQuery({ ...jobQuery, [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {
      name: validateName(jobQuery.name),
      email: validateEmail(jobQuery.email),
      phone: validatePhone(jobQuery.phone),
      experience: validateExperience(jobQuery.experience),
      skills: validateSkills(jobQuery.skills),
      message: validateMessage(jobQuery.message),
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const applyForJob = async (jobQuery) => {
    // Validate before submitting
    if (!validateAllFields()) {
      return;
    }

    const payload = {
      ...jobQuery,
    };
    const res = await query(type, id, payload);
    console.log("response of query in frontend", res);
    setRes(res);
  };

  const containerRef = useRef(null);

  // Effect to reset highlight after 2s
  useEffect(() => {
    if (!highlight || !containerRef.current) return;

    const el = containerRef.current;
    gsap.killTweensOf(el);
    gsap.set(el, { transformOrigin: "50% 50%", willChange: "transform" });

    gsap.to(el, {
      keyframes: [
        { scale: 1.15, duration: 0.1 },
        { scale: 0.95, duration: 0.08 },
        { scale: 1.08, duration: 0.08 },
        { scale: 1, duration: 0.06 },
      ],
      ease: "power2.out",
      onStart: () => {
        gsap.to(el, { border: "2px", borderColor: "orange", duration: 0.1 });
      },
      onComplete: () => {
        gsap.to(el, { borderColor: "#d1d5db", duration: 0.12 });
        gsap.set(el, { scale: 1 });
        setHighlight(false);
      },
    });
  }, [highlight, setHighlight]);

  return (
    <div
      ref={containerRef}
      className="bg-[#FFF8F3] h-full pt-2 w-full max-md:pt-7 min-h-[550px] relative rounded-xl transition-all"
    >
      <span
        onClick={() => setEnquirePop(false)}
        className="absolute md:hidden right-3 top-3 cursor-pointer"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.2848 8.96572L13.2077 12L16.2848 15.0343C16.3705 15.1145 16.4387 15.2114 16.4854 15.319C16.5321 15.4266 16.5562 15.5427 16.5562 15.66C16.5562 15.7773 16.5321 15.8934 16.4854 16.001C16.4387 16.1086 16.3705 16.2055 16.2848 16.2857C16.2047 16.3652 16.1098 16.428 16.0053 16.4707C15.9009 16.5133 15.7891 16.5349 15.6763 16.5343C15.4514 16.5333 15.2359 16.4441 15.0763 16.2857L11.9991 13.2086L8.96484 16.2857C8.80519 16.4441 8.58971 16.5333 8.36485 16.5343C8.25204 16.5349 8.14021 16.5133 8.03578 16.4707C7.93135 16.428 7.83637 16.3652 7.75627 16.2857C7.59663 16.1251 7.50702 15.9079 7.50702 15.6814C7.50702 15.455 7.59663 15.2377 7.75627 15.0771L10.7906 12L7.75627 8.96572C7.61585 8.80175 7.54247 8.59083 7.55081 8.3751C7.55914 8.15938 7.64857 7.95475 7.80122 7.80209C7.95387 7.64944 8.15851 7.56001 8.37423 7.55168C8.58995 7.54335 8.80087 7.61673 8.96484 7.75715L11.9991 10.7914L15.0334 7.75715C15.1128 7.67498 15.2075 7.60924 15.3123 7.5637C15.4171 7.51815 15.5298 7.49368 15.644 7.49169C15.7582 7.4897 15.8717 7.51023 15.978 7.5521C16.0842 7.59397 16.1812 7.65636 16.2634 7.73572C16.3456 7.81508 16.4113 7.90984 16.4569 8.0146C16.5024 8.11936 16.5269 8.23207 16.5289 8.34628C16.5309 8.4605 16.5103 8.57399 16.4685 8.68027C16.4266 8.78655 16.3642 8.88355 16.2848 8.96572ZM20.4848 20.4857C18.8066 22.1638 16.6684 23.3066 14.3406 23.7695C12.0129 24.2324 9.60015 23.9947 7.40751 23.0864C5.21487 22.1782 3.3408 20.6401 2.02228 18.6667C0.703756 16.6934 0 14.3733 0 12C0 9.62668 0.703756 7.30665 2.02228 5.33329C3.3408 3.35993 5.21487 1.82186 7.40751 0.913568C9.60015 0.00528063 12.0129 -0.232431 14.3406 0.230492C16.6684 0.693416 18.8066 1.83618 20.4848 3.51429C21.5993 4.62861 22.4833 5.95154 23.0864 7.40752C23.6896 8.86351 24 10.424 24 12C24 13.576 23.6896 15.1365 23.0864 16.5925C22.4833 18.0485 21.5993 19.3714 20.4848 20.4857ZM19.2763 4.72286C17.8364 3.28795 16.0036 2.31188 14.0093 1.9179C12.0151 1.52391 9.94878 1.72969 8.07139 2.50924C6.19401 3.28879 4.58971 4.60715 3.46108 6.29785C2.33245 7.98855 1.7301 9.97578 1.7301 12.0086C1.7301 14.0414 2.33245 16.0286 3.46108 17.7193C4.58971 19.41 6.19401 20.7284 8.07139 21.5079C9.94878 22.2875 12.0151 22.4932 14.0093 22.0993C16.0036 21.7053 17.8364 20.7292 19.2763 19.2943C20.2352 18.3387 20.996 17.2032 21.5151 15.953C22.0343 14.7028 22.3015 13.3623 22.3015 12.0086C22.3015 10.6548 22.0343 9.3144 21.5151 8.06416C20.996 6.81391 20.2352 5.67844 19.2763 4.72286Z"
            fill="#FF6E04"
          />
        </svg>
      </span>

      <h1 className="font-semibold 2xl:text-xl max-md:text-md ml-4 my-4">
        Apply For This Job
      </h1>

      {/* input section */}
      <div className="px-4 flex flex-col gap-3 text-[#323232]">
        <div>
          <InputWithSvg
            field={jobQuery.name}
            setField={(value) => handleFieldChange("name", value)}
            error={errors.name}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 16C6.41775 16 4.87103 15.5308 3.55544 14.6518C2.23985 13.7727 1.21447 12.5233 0.608967 11.0615C0.00346627 9.59966 -0.15496 7.99113 0.153721 6.43928C0.462403 4.88743 1.22433 3.46197 2.34315 2.34315C3.46197 1.22433 4.88743 0.462403 6.43928 0.153721C7.99113 -0.15496 9.59966 0.00346627 11.0615 0.608967C12.5233 1.21447 13.7727 2.23985 14.6518 3.55544C15.5308 4.87103 16 6.41775 16 8C15.9977 10.121 15.1541 12.1545 13.6543 13.6543C12.1545 15.1541 10.121 15.9977 8 16ZM8 8.72C6.384 8.72 3.224 9.5896 3.2 11.184C3.72542 11.9761 4.43869 12.6259 5.27622 13.0753C6.11374 13.5248 7.04949 13.76 8 13.76C8.95052 13.76 9.88626 13.5248 10.7238 13.0753C11.5613 12.6259 12.2746 11.9761 12.8 11.184C12.7864 10.2928 11.8072 9.6976 10.988 9.3552C10.0381 8.96602 9.02603 8.75087 8 8.72ZM8 2.4C7.52533 2.4 7.06131 2.54076 6.66663 2.80448C6.27196 3.06819 5.96434 3.44302 5.78269 3.88156C5.60104 4.32011 5.55351 4.80266 5.64612 5.26822C5.73872 5.73377 5.9673 6.16141 6.30295 6.49706C6.63859 6.83271 7.06623 7.06128 7.53179 7.15389C7.99734 7.24649 8.4799 7.19896 8.91844 7.01731C9.35699 6.83566 9.73181 6.52805 9.99553 6.13337C10.2592 5.73869 10.4 5.27468 10.4 4.8C10.4 4.16348 10.1471 3.55303 9.69706 3.10295C9.24697 2.65286 8.63652 2.4 8 2.4Z"
                  fill={errors.name ? "#EF4444" : "#D1D1D1"}
                />
              </svg>
            }
            placeholder="Full Name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
          )}
        </div>

        <div>
          <InputWithSvg
            field={jobQuery.email}
            setField={(value) => handleFieldChange("email", value)}
            error={errors.email}
            icon={
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.0001 10.6595C16.955 10.7998 16.9104 10.9396 16.8518 11.1203C15.1434 9.37708 13.4563 7.65645 11.8096 5.9761C13.4502 4.3043 15.1404 2.58123 16.8524 0.836182C16.9098 1.01563 16.955 1.1554 17.0001 1.29579C17.0001 4.41722 17.0001 7.53803 17.0001 10.6595Z"
                  fill={errors.email ? "#EF4444" : "#D1D1D1"}
                />
                <path
                  d="M0.830078 0.110477C1.10291 0.0695823 1.33363 0.00793485 1.56496 0.00610375C2.76556 -0.00366216 3.96615 0.00122068 5.16675 0.00122068C8.57505 0.00122068 11.984 -0.000610211 15.3923 0.00549348C15.6358 0.00610385 15.8793 0.0653093 16.1223 0.0976589C16.1247 0.117191 16.1278 0.136723 16.1302 0.156865C16.0911 0.19837 16.0533 0.241706 16.013 0.281991C13.8871 2.39753 11.7618 4.51307 9.63526 6.628C9.07555 7.18465 8.39499 7.29757 7.748 6.93196C7.61494 6.85689 7.49409 6.75373 7.38544 6.64509C5.24549 4.52039 3.10859 2.39265 0.971073 0.26551C0.936282 0.230719 0.905154 0.193487 0.830078 0.110477Z"
                  fill={errors.email ? "#EF4444" : "#D1D1D1"}
                />
                <path
                  d="M5.99478 6.66333C6.24625 6.91663 6.46293 7.13759 6.68266 7.35549C7.73921 8.40288 9.2572 8.40471 10.3131 7.35976C10.5365 7.13881 10.7563 6.9148 11.001 6.66882C12.7009 8.40288 14.388 10.1235 16.0762 11.8448C15.9481 11.8728 15.7692 11.9137 15.5892 11.9497C15.5409 11.9595 15.4897 11.954 15.4402 11.954C10.8155 11.954 6.19009 11.9558 1.56533 11.9497C1.334 11.9497 1.10267 11.8856 0.899414 11.8557C2.60173 10.1205 4.29001 8.40044 5.99478 6.66333Z"
                  fill={errors.email ? "#EF4444" : "#D1D1D1"}
                />
                <path
                  d="M0.11124 11.0824C0.0740072 10.8792 0.00564591 10.6753 0.00503554 10.4721C-0.00167852 7.47822 -0.00167852 4.48497 0.00503554 1.49111C0.00564591 1.28663 0.0727864 1.08216 0.108798 0.877076C0.126499 0.872803 0.14481 0.86853 0.162511 0.864258C1.84835 2.58489 3.5348 4.30552 5.18219 5.98709C3.55128 7.65034 1.86117 9.37402 0.170446 11.0977C0.150914 11.0922 0.131382 11.0873 0.11124 11.0824Z"
                  fill={errors.email ? "#EF4444" : "#D1D1D1"}
                />
              </svg>
            }
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
          )}
        </div>

        <div>
          <InputWithSvg
            field={jobQuery.phone}
            setField={(value) => handleFieldChange("phone", value)}
            error={errors.phone}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 11.431C14 11.683 13.9439 11.942 13.8247 12.194C13.7056 12.446 13.5513 12.684 13.348 12.908C13.0045 13.286 12.6259 13.559 12.1983 13.734C11.7777 13.909 11.322 14 10.8312 14C10.1162 14 9.35203 13.832 8.54582 13.489C7.73961 13.146 6.9334 12.684 6.1342 12.103C5.32799 11.515 4.56385 10.864 3.83475 10.143C3.11267 9.415 2.46069 8.652 1.87882 7.854C1.30396 7.056 0.841262 6.258 0.504757 5.467C0.168252 4.669 0 3.906 0 3.178C0 2.702 0.0841261 2.247 0.252378 1.827C0.420631 1.4 0.687031 1.008 1.05859 0.658C1.50726 0.217 1.998 0 2.51678 0C2.71307 0 2.90936 0.042 3.08463 0.126C3.2669 0.21 3.42814 0.336 3.55433 0.518L5.18077 2.807C5.30696 2.982 5.3981 3.143 5.46119 3.297C5.52429 3.444 5.55934 3.591 5.55934 3.724C5.55934 3.892 5.51027 4.06 5.41212 4.221C5.32098 4.382 5.18778 4.55 5.01953 4.718L4.48673 5.271C4.40961 5.348 4.37456 5.439 4.37456 5.551C4.37456 5.607 4.38157 5.656 4.39559 5.712C4.41663 5.768 4.43766 5.81 4.45168 5.852C4.57787 6.083 4.79519 6.384 5.10366 6.748C5.41913 7.112 5.75563 7.483 6.12018 7.854C6.49875 8.225 6.8633 8.568 7.23485 8.883C7.5994 9.191 7.90085 9.401 8.13921 9.527C8.17426 9.541 8.21632 9.562 8.2654 9.583C8.32148 9.604 8.37757 9.611 8.44066 9.611C8.55984 9.611 8.65098 9.569 8.72809 9.492L9.26089 8.967C9.43615 8.792 9.60441 8.659 9.76565 8.575C9.92689 8.477 10.0881 8.428 10.2634 8.428C10.3966 8.428 10.5368 8.456 10.691 8.519C10.8453 8.582 11.0065 8.673 11.1818 8.792L13.5023 10.437C13.6845 10.563 13.8107 10.71 13.8878 10.885C13.9579 11.06 14 11.235 14 11.431Z"
                  fill={errors.phone ? "#EF4444" : "#D1D1D1"}
                />
              </svg>
            }
            placeholder="Mobile Number"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <InputWithSvg
            field={jobQuery.experience}
            setField={(value) => handleFieldChange("experience", value)}
            error={errors.experience}
            icon={
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.9891 6.82264C16.8798 6.82264 15.9774 7.79939 15.9774 9.00004C15.9774 9.98769 16.5878 10.8229 17.4209 11.0884C16.5534 14.7089 13.4837 17.3015 10 17.3015C7.42657 17.3015 5.03759 15.9129 3.61088 13.5889C3.51255 13.4282 3.31177 13.3845 3.16376 13.491C3.01522 13.598 2.97495 13.8146 3.07383 13.9748C4.62054 16.4955 7.20926 18 10 18C13.8165 18 17.1468 15.1751 18.0658 11.1757C19.1391 11.132 20 10.1733 20 9.00004C20 7.79939 19.0978 6.82264 17.9891 6.82264ZM4.02259 9.00004C4.02259 10.2012 3.12018 11.1779 2.01119 11.1779C0.902203 11.1779 0 10.2012 0 9.00004C0 7.82729 0.860863 6.86799 1.93423 6.82435C2.85321 2.82456 6.18303 0 10 0C12.7902 0 15.3797 1.50499 16.9267 4.02522C17.0248 4.18593 16.9845 4.40199 16.8363 4.50942C16.6875 4.61599 16.488 4.57181 16.3892 4.41155C14.9624 2.08662 12.5737 0.698605 10 0.698605C6.51653 0.698605 3.44631 3.29127 2.57932 6.91163C3.41242 7.17717 4.02259 8.01285 4.02259 9.00004ZM10.9618 3.57197L10.2263 4.67489C10.171 4.75733 10.1501 4.8613 10.1689 4.96177L11.3811 11.4385L10 12.9645L8.6189 11.4385L9.83132 4.96182C9.84992 4.86139 9.82929 4.75737 9.77428 4.67493L9.03877 3.57201C9.38395 3.2718 9.70407 2.94414 10 2.58607C10.2953 2.94244 10.6173 3.27382 10.9618 3.57197ZM8.49558 4.00548L9.14117 4.97267L7.92207 11.4835C7.89991 11.6019 7.93355 11.7249 8.01176 11.8115L9.7592 13.7421C9.89193 13.8879 10.1085 13.8879 10.2407 13.7421L11.9879 11.8115C12.0661 11.7249 12.1 11.6019 12.0776 11.4835L10.8593 4.97267L11.5041 4.00548C12.3872 4.64775 13.3494 5.06126 14.3056 5.20058V9.90027C14.3056 12.3812 12.0768 13.9761 9.99996 15.5218C7.93173 13.9727 5.69382 12.3943 5.69382 9.90027V5.20058C6.65029 5.06126 7.61256 4.64775 8.49558 4.00548Z"
                  fill={errors.experience ? "#EF4444" : "#D1D1D1"}
                />
              </svg>
            }
            placeholder="Years of Experience"
          />
          {errors.experience && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.experience}
            </p>
          )}
        </div>

        <div>
          <InputWithSvg
            field={jobQuery.skills}
            setField={(value) => handleFieldChange("skills", value)}
            error={errors.skills}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1291 8.25773C10.8929 8.25773 10.6634 8.2866 10.4436 8.34063L5.65955 3.55657C5.71361 3.33681 5.74246 3.10729 5.74246 2.87112C5.74246 1.288 4.45448 0 2.87136 0C2.52511 0 2.18597 0.0615234 1.86331 0.182848C1.73283 0.231902 1.63622 0.343875 1.60677 0.480101C1.57732 0.616328 1.6191 0.758214 1.71765 0.856761L2.54307 1.68216L2.4287 2.42837L1.68246 2.54272L0.85706 1.71732C0.758513 1.61878 0.616572 1.57708 0.4804 1.60644C0.344146 1.63587 0.232174 1.7325 0.183119 1.86296C0.0617675 2.18561 0.000244141 2.52481 0.000244141 2.87112C0.000244141 4.45424 1.28822 5.74221 2.87134 5.74221C3.10756 5.74221 3.33711 5.71334 3.55687 5.65931L8.34093 10.4433C8.28687 10.6631 8.25802 10.8926 8.25802 11.1288C8.25802 12.7119 9.546 13.9999 11.1291 13.9999C11.4754 13.9999 11.8146 13.9384 12.1372 13.817C12.2677 13.768 12.3643 13.656 12.3937 13.5198C12.4232 13.3835 12.3814 13.2416 12.2829 13.1431L11.4574 12.3177L11.5718 11.5715L12.318 11.4572L13.1434 12.2826C13.242 12.3811 13.3838 12.4229 13.5201 12.3935C13.6563 12.364 13.7683 12.2674 13.8173 12.137C13.9387 11.8143 14.0002 11.4751 14.0002 11.1288C14.0002 9.5457 12.7123 8.25773 11.1291 8.25773Z"
                  fill={errors.skills ? "#EF4444" : "#D1D1D1"}
                />
                <path
                  d="M12.7196 3.38301L13.8799 2.22277C13.9568 2.14585 14 2.04153 14 1.93276C14 1.82396 13.9568 1.71964 13.8799 1.64275L12.3572 0.120114C12.1971 -0.0400381 11.9373 -0.0400381 11.7772 0.120114L10.6169 1.28034L12.7196 3.38301Z"
                  fill={errors.skills ? "#EF4444" : "#D1D1D1"}
                />
                <path
                  d="M1.10227 10.9795L0.0342757 13.4257C-0.033236 13.5803 0.000834321 13.7605 0.120162 13.8798C0.198694 13.9584 0.303612 14 0.410279 14C0.465623 14 0.521459 13.9888 0.574315 13.9657L3.02051 12.8977L1.10227 10.9795Z"
                  fill={errors.skills ? "#EF4444" : "#D1D1D1"}
                />
                <path
                  d="M7.57886 4.31787L10.0353 1.86139L12.1377 3.96375L9.68121 6.42023L7.57886 4.31787Z"
                  fill={errors.skills ? "#EF4444" : "#D1D1D1"}
                />
                <path
                  d="M1.58887 10.3064L4.31563 7.57963L6.41799 9.68199L3.69122 12.4088L1.58887 10.3064Z"
                  fill={errors.skills ? "#EF4444" : "#D1D1D1"}
                />
              </svg>
            }
            placeholder="Add your skills i.e c++, java, etc"
          />
          {errors.skills && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.skills}</p>
          )}
        </div>

        <div>
          <textarea
            value={jobQuery.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            placeholder="Type Your Message..."
            className={`w-full px-3 py-2 border rounded-lg text-sm h-18 resize-none ${
              errors.message
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#E0E3E5] focus:border-orange-500"
            } bg-white`}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.message}</p>
          )}
        </div>

        <Image
          src="/assets/SeeDetails/recaptcha.png"
          alt="recaptcha"
          height={500}
          width={500}
          className="w-full h-auto"
        />
        <button
          onClick={() => applyForJob(jobQuery)}
          className="w-full bg-[#FF6E04] rounded-md cursor-pointer text-white font-semibold text-center py-2 hover:bg-[#FF5504] transition-colors"
        >
          Send Enquiry
        </button>
      </div>

      <div className="absolute min-w-full -bottom-14 2xl:-bottom-16 rounded-xl">
        <Image
          src="/assets/seeDetails/get-more-info-bottom.png"
          href="Border"
          height={500}
          width={500}
          className="w-full h-30"
        />
      </div>

      {res !== null && <ResponseAlert text={res} />}
    </div>
  );
};

export default ApplyForJob;
