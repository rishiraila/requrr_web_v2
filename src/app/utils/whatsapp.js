export const sendWhatsApp = async ({
  to,
  templateName = "payment_reminder",
  variables = [],
  namespace = process.env.MSG91_WHATSAPP_NAMESPACE,
}) => {
  if (!to) throw new Error("WhatsApp recipient number missing");

  const toList = Array.isArray(to) ? to : [to];
  const cleanedNumbers = toList.map(num => String(num).replace(/\D/g, ""));

  const components = {};
  variables.forEach((v, i) => {
    components[`body_${i + 1}`] = { type: "text", value: String(v) };
  });

  const payload = {
    integrated_number: process.env.MSG91_WHATSAPP_NUMBER,
    content_type: "template",
    payload: {
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: templateName,
        language: { code: "en_GB", policy: "deterministic" },
        namespace,
        to_and_components: [
          {
            to: cleanedNumbers,
            components,
          },
        ],
      },
    },
  };

  const response = await fetch(
    "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: process.env.MSG91_AUTH_KEY,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error("MSG91 error:", data);
    throw new Error(data?.message || "Failed to send WhatsApp");
  }
  return data;
};
