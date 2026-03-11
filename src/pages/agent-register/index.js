import OTPPopup from "@/components/Register/OTPPopup";
import RegistrationForm from "@/components/Register/RegistrationForm";
import React, { useState } from "react";

const AgentRegister = () => {
  const [pop, setPop] = useState(false);
  const [userId, setUserId] = useState(null);
  return (
    <>
      <div className="  max-w-[2000px]">
        <div className="w-[80%] mx-auto  bg-white">
          <h2 className="w-full text-center text-2xl font-semibold pt-10 text-orange-500">
            AGENT REGISTER
          </h2>
          <section className=" max-w-[400px] mx-auto py-10">
            <RegistrationForm type={"agent"} setPop={setPop} setUserId={setUserId} userId={userId} />
          </section>
        </div>
      </div>

      {pop && <OTPPopup setPop={setPop} userId={userId} />}
    </>
  );
};

export default AgentRegister;
