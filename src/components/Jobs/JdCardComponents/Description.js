import React from "react";

const Section = ({ title, children }) => (
  <div className="space-y-2.5">
    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
      {title}
    </h3>
    <div className="text-sm text-zinc-600 leading-relaxed">{children}</div>
  </div>
);

const Divider = () => <hr className="border-zinc-100" />;

const Description = ({
  desc,
  roles = [],
  qualifications = [],
  keySkills = [],
  companyName,
  companyDesc,
  address,
  city,
}) => {
  return (
    <div className="space-y-5">
      {/* Job Description */}
      {desc && (
        <>
          <Section title="About the Role">
            <p>{desc}</p>
          </Section>
          <Divider />
        </>
      )}

      {/* Responsibilities */}
      {roles.length > 0 && (
        <>
          <Section title="Responsibilities">
            <ul className="space-y-1.5">
              {roles.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
          <Divider />
        </>
      )}

      {/* Requirements */}
      {qualifications.length > 0 && (
        <>
          <Section title="Requirements">
            <ul className="space-y-1.5">
              {qualifications.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  {typeof item === "string" ? item : item?.level || "N/A"}
                </li>
              ))}
            </ul>
          </Section>
          <Divider />
        </>
      )}

      {/* Skills */}
      {keySkills.length > 0 && (
        <>
          <Section title="Key Skills">
            <div className="flex flex-wrap gap-2 mt-1">
              {keySkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* Company */}
      {(companyName || companyDesc) && (
        <>
          <Section title={companyName || "About the Company"}>
            {companyDesc && <p>{companyDesc}</p>}
            {(address || city) && (
              <p className="mt-2 text-zinc-500">
                {[address, city].filter(Boolean).join(", ")}
              </p>
            )}
          </Section>
        </>
      )}
    </div>
  );
};

export default Description;
