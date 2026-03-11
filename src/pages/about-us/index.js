import Title from "@/components/AboutUs/Title";
import React from "react";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="w-full h-full max-md:w-[94%] max-md:mx-auto max-md:mt-3 flex flex-col items-center  ">
      {/* image section */}
      <div className="md:w-full md:h-70  max-md:w-full  2xl:w-[80%] relative ">
        <Image
          src={`/assets/about-us/b1.png`}
          alt="banner"
          height={5000}
          width={5000}
          className="object-cover max-md:object-contain md:absolute cursor-pointer  h-full w-full"
        />
      </div>

      {/* text section */}
      <div className=" flex flex-col  bg-white max-md:pl-1  pb-15 w-full pl-15 2xl:pl-10 2xl:w-[80%] ">
        {/* about us  */}
        <Title text={"About Us"} icon={"about"} />
        <p className="text-sm font-[500] md:pl-1 md:pr-17 max-md:px-1">
          Address Guru is an online business directory where businesses of every
          category are listed and promoted. Address guru helps in getting locals
          as well as big businesses have an online presence and reach among the
          online audience. This is done through online posting of Ads on our
          website.
          <br />
          <br />
          Address Guru makes sure you get the right and correct business
          information on our platform.
          <br />
          <br />
          Maintaining authenticity between the sellers and buyers on our
          platform.
          <br />
          <br />
          On Address Guru, sellers can advertise their business with banner ads
          and listing their businesses.
          <br />
          <br />
          Addressguru is a bridge between the buyers looking for sellers and
          manufacturers of a product and addressguru helps them discover their
          preferred business easily in their area. For sellers, addressguru is
          providing a platform to display their business and get themselves in
          the eyes of the perspective buyers and get new clients and customers
          on board. This ultimately helps the businesses in their growth and
          popularity in both online and offline world.
          <br />
          <br />
          With AddressGuru, both buyers and sellers can easily interact with
          each other and do business. Address guru verifies the buyers and aims
          at listing only the correct information.
        </p>
        {/* mission */}
        <Title text={"Address Guru's Mission"} icon={"mission"} />
        <div className="text-sm  font-[500] pl-1 pr-17 max-md:pr-1">
          We aim at providing a single platform to all the sellers and buyers to
          discover and connect and conduct business easily and safely.
        </div>

        {/* background */}
        <Title text={"Corporation Background"} icon={"background-checking"} />
        <ol className="text-sm  font-[500] pl-5 max-w-[64rem] list-decimal">
          <li>
            The company commenced in 2019 offering local business directories
            and then reaching out at country level and then to international
            level.
          </li>
          <li>The official addressguru website was launched in 2018.</li>
          <li>
            Address Guru Search services provide a bridge to the businesses and
            its prospective buyers to discover and connect. It provides many
            opportunities to the businesses to market their business
            effectively.
          </li>
        </ol>
        {/* highlights */}
        <Title text={"Key Highlights of Address Guru"} icon={"sparkle"} />
        <ul className="text-sm  font-[500] pl-5 max-w-[64rem] list-disc space-y-1">
          <li>
            <strong>International Presence</strong> - Address Guru has an
            international presence from India to.
          </li>
          <li>
            <strong>Large Community of Users</strong> - Address Guru is having a
            very large user base of sellers.
          </li>
          <li>
            <strong>Local Business Reach</strong> - With specific reach for the
            local business we help the users to search for their relevant
            products easily in their local area.
          </li>
        </ul>

        {/* policy */}
        <Title text={"Infringement Policy"} icon={"violation"} />
        <p className="text-sm  font-[500] pl-1 pr-17 max-md:pr-1">
          All the trademark, logos, service names and other marks are property
          of address guru and the vendors.
          <br />
          <br />
          Address Guru uses the marks and information of the vendors for the
          distribution of information. Address guru have no intention to falsely
          claim any property owned by the vendors.
          <br />
          <br />
          The infringement policy of Address Guru states that all the property
          provided on the website are owned by the vendors and users providing
          information on the website which comply to the Address Guru rules of
          posting.
          <br />
          <br />
          If you find any information is violating any intellectual property,
          then you can report the infringement at contact@addressguru.in
        </p>

        <Title text={"How to report listing infringement"} icon={"cancel"} />
        <p className="text-sm font-[500]">
          You infringement email should include these things :
        </p>
        <ul className="text-xs font-[500] pl-5 max-w-[64rem] list-disc space-y-1">
          <li>Identification of the infringed property</li>
          <li>
            Description of the information or material that has been infringed
          </li>
          <li>Your address, contact number and email</li>
          <li>
            A written statement confirming that the information provided by you
            is correct and you hold the utmost right to the property and act as
            the rightful owner of the property.
          </li>
          <li>Brand name (in case of Trademark infringement)</li>
          <li>Details of the property infringed</li>
          <li>
            Documents for legal proceedings against the party infringing the
            property.
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
