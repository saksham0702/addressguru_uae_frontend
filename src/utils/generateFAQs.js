export const generateFAQs = (data, city) => {
  const faqs = [];
  const businessName = data?.businessName || "this business";
  const address = data?.businessAddress || "";

  // 1. Business Address FAQ
  if (address) {
    faqs.push({
      question: `Where is ${businessName} located?`,
      answer: `${businessName} is located at ${address}, ${city || "UAE"}. You can easily find us at this address or view the location on the map above.`,
    });
  }

  // 2. Working Hours FAQ
  if (data?.workingHours) {
    const hasHours = Object.values(data.workingHours).some(
      (day) => day?.open && day?.close,
    );
    if (hasHours) {
      faqs.push({
        question: `What are the working hours of ${businessName}?`,
        answer: `${businessName} operates during the following hours. Please check the 'Quick Information' section above for detailed timings for each day of the week.`,
      });
    }
  }

  // 3. Services FAQ
  if (data?.services && data.services.length > 0) {
    const servicesList = data.services
      .slice(0, 8)
      .map((s) => s.name)
      .join(", ");
    faqs.push({
      question: `What services does ${businessName} offer?`,
      answer: `${businessName} offers a wide range of services including: ${servicesList}${data.services.length > 8 ? ", and more" : ""}. For complete details, please check the Services section above or contact them directly.`,
    });
  }

  // 4. Facilities FAQ
  if (data?.facilities && data.facilities.length > 0) {
    const facilitiesList = data.facilities
      .slice(0, 8)
      .map((f) => f.name)
      .join(", ");
    faqs.push({
      question: `What facilities are available at ${businessName}?`,
      answer: `${businessName} provides excellent facilities such as: ${facilitiesList}${data.facilities.length > 8 ? ", among others" : ""}. These facilities ensure a comfortable and convenient experience for all visitors.`,
    });
  }

  // 5. Payment Methods FAQ
  if (data?.paymentModes && data.paymentModes.length > 0) {
    const paymentsList = data.paymentModes.map((p) => p.name).join(", ");
    faqs.push({
      question: `What payment methods does ${businessName} accept?`,
      answer: `${businessName} accepts the following payment methods: ${paymentsList}. This provides flexibility and convenience for all customers.`,
    });
  }

  // 6. Courses FAQ (if applicable)
  if (data?.courses && data.courses.length > 0) {
    const coursesList = data.courses
      .slice(0, 6)
      .map((c) => c.name)
      .join(", ");
    faqs.push({
      question: `What courses are offered at ${businessName}?`,
      answer: `${businessName} offers various courses including: ${coursesList}${data.courses.length > 6 ? ", and more" : ""}. Contact them for detailed course information, schedules, and enrollment.`,
    });
  }

  // 7. Contact FAQ
  if (data?.mobileNumber || data?.email) {
    const contactInfo = [];
    if (data.mobileNumber) {
      contactInfo.push(
        `phone at ${data.countryCode || ""} ${data.mobileNumber}`,
      );
    }
    if (data.email) {
      contactInfo.push(`email at ${data.email}`);
    }
    faqs.push({
      question: `How can I contact ${businessName}?`,
      answer: `You can reach ${businessName} via ${contactInfo.join(" or ")}. Their team will be happy to assist you with any inquiries or bookings.`,
    });
  }

  // 8. Category-specific FAQ
  if (data?.category?.name) {
    faqs.push({
      question: `What type of business is ${businessName}?`,
      answer: `${businessName} is a ${data.category.name} located in ${city || "UAE"}. They are committed to providing quality ${data.category.name.toLowerCase()} services to their customers.`,
    });
  }

  // 9. Booking/Enquiry FAQ
  faqs.push({
    question: `How do I book or make an enquiry at ${businessName}?`,
    answer: `You can easily make an enquiry by clicking the "Get More Info" or "Send Enquiry" button on this page. Fill in your details and requirements, and the ${businessName} team will get back to you promptly.`,
  });

  // 10. Ratings FAQ
  if (data?.ratings && data.ratings.length > 0) {
    const avgRating = (
      data.ratings.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
      data.ratings.length
    ).toFixed(1);
    faqs.push({
      question: `What do customers say about ${businessName}?`,
      answer: `${businessName} has received ${data.ratings.length} customer review${data.ratings.length > 1 ? "s" : ""} with an average rating of ${avgRating} out of 5 stars. Check the 'Recent Customer Reviews' section to read what customers are saying.`,
    });
  }

  // 11. Website FAQ
  if (data?.websiteLink) {
    faqs.push({
      question: `Does ${businessName} have a website?`,
      answer: `Yes, you can visit the official website of ${businessName} for more information about their services, offerings, and updates. The website link is available in the Quick Information section above.`,
    });
  }

  return faqs;
};
